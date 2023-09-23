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
exports.getMessages = exports.addMessage = void 0;
const message_1 = require("../models/message");
const user_1 = require("../models/user");
const sequelize_1 = require("sequelize");
const admin_1 = require("../models/admin");
const addMessage = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { groupID, message } = req.body;
    try {
        yield req.user.createMessage({ message: message, groupId: groupID });
        res.status(201).json({ message: 'message saved to database' });
    }
    catch (error) {
        console.log('Error while storing message: ', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.addMessage = addMessage;
const getMessages = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { groupID, latestMessageID } = req.query;
    let whereClause = {
        groupId: groupID,
    };
    try {
        if (latestMessageID !== undefined) {
            whereClause.id = {
                [sequelize_1.Op.gt]: latestMessageID,
            };
        }
        ;
        const messages = yield message_1.Message.findAll({
            where: whereClause,
            include: {
                model: user_1.User,
                attributes: ['name'],
            }
        });
        if (messages.length <= 0) {
            return res.status(404).json({ message: 'No message in the group!' });
        }
        const admin = yield admin_1.Admin.findOne({ where: { UserId: req.user.id } });
        const isadmin = admin !== null;
        res.status(201).json({ data: messages, isAdmin: isadmin });
    }
    catch (error) {
        console.log('Error while getting messages: ', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.getMessages = getMessages;
