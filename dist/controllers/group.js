"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeAdmin = exports.removeAdmin = exports.removeUser = exports.addGroupUser = exports.getGroups = exports.createGroup = void 0;
const user_1 = require("../models/user");
const member_1 = require("../models/member");
const group_1 = require("../models/group");
const database_1 = __importDefault(require("../util/database"));
const createGroup = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { group } = req.body;
    try {
        const groupDetails = yield group_1.Group.create({ name: group });
        const member = yield member_1.Member.create({
            UserId: req.user.id,
            groupId: groupDetails.id,
            isAdmin: true,
        });
        res.sendStatus(200);
    }
    catch (error) {
        console.error('Error while creating group', error);
        res.status(500).json({ message: 'Internal server error!' });
    }
});
exports.createGroup = createGroup;
const getGroups = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const groups = yield req.user.getGroups();
        if (groups.length <= 0) {
            return res.status(404).json({ message: 'You are not part of any group' });
        }
        res.status(201).json(groups);
    }
    catch (error) {
        console.error('Error while getting groups', error);
        res.status(500).json({ message: 'Internal server error!' });
    }
});
exports.getGroups = getGroups;
const addGroupUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { userID, groupID } = req.body;
    try {
        const [user, group] = yield Promise.all([
            user_1.User.findByPk(userID),
            group_1.Group.findByPk(groupID)
        ]);
        if (!user || !group) {
            return res.status(404).json({ message: user ? 'User not found' : 'Group not found' });
        }
        const exist = yield group.hasUser(user);
        if (exist) {
            return res.status(200).json({ message: 'User already added to group!' });
        }
        yield member_1.Member.create({
            UserId: user.id,
            groupId: group.id,
        });
        res.status(200).json({ message: 'User added to group' });
    }
    catch (error) {
        console.error('Error while Adding user to group', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.addGroupUser = addGroupUser;
const removeUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { groupID, deleteID } = req.query;
    const t = yield database_1.default.transaction();
    try {
        const rowsDeleted = yield member_1.Member.destroy({
            where: {
                UserId: deleteID,
                groupId: groupID,
            },
            transaction: t,
        });
        if (rowsDeleted === 0) {
            yield t.rollback();
            return res.status(404).json({ message: 'User not found in the group' });
        }
        ;
        const members = yield member_1.Member.findAll({
            where: {
                groupId: groupID,
            },
            transaction: t,
        });
        if (members.length === 0) {
            yield group_1.Group.destroy({
                where: {
                    id: groupID,
                },
                transaction: t,
            });
        }
        yield t.commit();
        res.status(200).json({ message: 'User removed from group' });
    }
    catch (error) {
        yield t.rollback();
        console.error('Error while removing user from group', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.removeUser = removeUser;
const removeAdmin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { groupID, userID } = req.query;
    try {
        const member = yield member_1.Member.findOne({
            where: {
                UserId: userID,
                groupId: groupID,
            }
        });
        if (!member) {
            return res.status(404).json({ message: 'Member does not exist in this group!' });
        }
        yield member.update({ isAdmin: false });
        const group = yield group_1.Group.findByPk(groupID);
        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }
        const remainingAdmins = yield member_1.Member.findAll({
            where: {
                groupId: groupID,
                isAdmin: true,
            }
        });
        if (remainingAdmins.length === 0) {
            yield group.destroy();
            return res.status(200).json({ message: 'Group destroyed due to last admin removal' });
        }
        res.status(200).json({ message: 'demote to user!' });
    }
    catch (error) {
        console.log('Error while making user admin!', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});
exports.removeAdmin = removeAdmin;
const makeAdmin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { groupID, userID } = req.query;
    try {
        const member = yield member_1.Member.findOne({
            where: {
                UserId: userID,
                groupId: groupID,
            }
        });
        if (!member) {
            return res.status(404).json({ message: 'Member does not exist in group!' });
        }
        yield member.update({ isAdmin: true });
        res.status(200).json({ message: 'promoted to admin!' });
    }
    catch (error) {
        console.log('Error while making user admin!', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});
exports.makeAdmin = makeAdmin;
