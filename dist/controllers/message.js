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
exports.showGroupUsers = exports.getByEmail = exports.getMessages = exports.addMessage = void 0;
const user_1 = require("../models/user");
const group_1 = require("../models/group");
const s3Services_1 = __importDefault(require("../services/s3Services"));
const member_1 = require("../models/member");
const addMessage = (io) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const { groupID, message } = req.body;
        const file = req.file;
        try {
            //finding if user is member of a group
            const user = yield member_1.Member.findOne({
                where: {
                    groupId: groupID,
                    UserId: req.user.id,
                },
            });
            if (!user) {
                return res.status(404).json({ message: 'You are not part of this group anymore!' });
            }
            const chatMessage = {
                name: req.user.name,
                groupId: groupID
            };
            const saveMessage = {
                groupId: groupID
            };
            //if request contains file then add file
            if (file) {
                const filename = `${Date.now()}_${req.user.id}_${file.originalname}`;
                const url = yield (0, s3Services_1.default)(file, filename);
                chatMessage.File = url;
                saveMessage.file = url;
            }
            //if request contains message then add message
            if (message) {
                chatMessage.message = message;
                saveMessage.message = message;
            }
            console.log(chatMessage);
            io.emit('chat message', chatMessage);
            yield req.user.createMessage(saveMessage);
            res.status(201).json({ message: 'Message saved to the database' });
        }
        catch (error) {
            console.log('Error while storing message: ', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    });
};
exports.addMessage = addMessage;
const getMessages = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { groupID } = req.query;
    try {
        const member = yield member_1.Member.findOne({
            where: {
                UserId: req.user.id,
                groupId: groupID,
            }
        });
        const isadmin = member === null || member === void 0 ? void 0 : member.isAdmin;
        const group = yield group_1.Group.findByPk(groupID);
        if (!group) {
            return res.status(404).json({ message: 'Group does not exits anymore!' });
        }
        const messages = yield group.getMessages({
            include: [
                {
                    model: user_1.User,
                    attributes: ['name'],
                }
            ]
        });
        if (messages.length <= 0) {
            return res.status(404).json({ message: 'No message in the group!', groupDetails: group, isAdmin: isadmin });
        }
        res.status(201).json({ messages: messages, groupDetails: group, isAdmin: isadmin });
    }
    catch (error) {
        console.log('Error while getting messages: ', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.getMessages = getMessages;
const getByEmail = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { userEmail } = req.query;
    try {
        const user = yield user_1.User.findOne({
            where: { email: userEmail },
            attributes: ['id', 'name'],
        });
        if (!user) {
            return res.status(404).json({ message: 'No user exist with this email!' });
        }
        res.status(200).json({ user: user });
    }
    catch (error) {
        console.log('Error while finding user: ', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.getByEmail = getByEmail;
const showGroupUsers = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { groupID } = req.query;
    try {
        const members = yield group_1.Group.findByPk(groupID, {
            include: [
                {
                    model: user_1.User,
                    attributes: ['id', 'name'],
                    through: {
                        attributes: ['isAdmin'],
                    },
                },
            ],
        });
        if (!members) {
            return res.status(404).json({ message: 'No user is added in the group' });
        }
        ;
        res.status(200).json({ users: members });
    }
    catch (error) {
        console.log('Error while fetching group users: ', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.showGroupUsers = showGroupUsers;
