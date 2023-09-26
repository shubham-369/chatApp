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
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeAdmin = exports.removeAdmin = exports.removeUser = exports.addGroupUser = exports.getGroups = exports.createGroup = void 0;
const user_1 = require("../models/user");
const admin_1 = require("../models/admin");
const group_1 = require("../models/group");
const createGroup = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { group } = req.body;
    try {
        const [createdGroup, admin] = yield Promise.all([
            group_1.Group.create({ name: group }),
            admin_1.Admin.create({ UserId: req.user.id }),
        ]);
        yield Promise.all([
            admin.addGroup(createdGroup),
            req.user.addGroup(createdGroup),
        ]);
        res.sendStatus(200);
    }
    catch (error) {
        console.log('Error while creating group', error);
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
        console.log('Error while getting groups', error);
        res.status(500).json({ message: 'Internal server error!' });
    }
});
exports.getGroups = getGroups;
const addGroupUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { userID, groupID } = req.body;
    try {
        const user = yield user_1.User.findByPk(userID);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const group = yield group_1.Group.findByPk(groupID);
        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }
        const exist = yield group.hasUser(user);
        if (exist) {
            return res.status(200).json({ message: 'User already added to group!' });
        }
        yield group.addUser(user);
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
    try {
        const group = yield group_1.Group.findByPk(groupID);
        if (!group) {
            return res.status(404).json({ message: 'Group does not exist anymore!' });
        }
        const user = yield user_1.User.findByPk(deleteID);
        if (!user) {
            return res.status(404).json({ message: 'User is not a part of group' });
        }
        yield group.removeUser(user);
        res.status(200).json({ message: 'User removed from group' });
    }
    catch (error) {
        console.error('Error while removing user from group', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.removeUser = removeUser;
const removeAdmin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { groupID, userID } = req.query;
    try {
        const group = yield group_1.Group.findByPk(groupID);
        if (!group) {
            return res.status(404).json({ message: 'Your group does not exist anymore' });
        }
        const admin = yield admin_1.Admin.findOne({ where: { UserId: userID } });
        if (!admin) {
            return res.status(404).json({ message: 'Already demoted to user' });
        }
        yield admin.destroy();
        const remainingAdmins = yield group.getAdmins();
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
        const group = yield group_1.Group.findByPk(groupID);
        if (!group) {
            return res.status(404).json({ message: 'Your group does not exist anymore' });
        }
        const admin = yield admin_1.Admin.create({ UserId: userID });
        yield group.addAdmin(admin);
        res.status(200).json({ message: 'promoted to admin!' });
    }
    catch (error) {
        console.log('Error while making user admin!', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});
exports.makeAdmin = makeAdmin;
