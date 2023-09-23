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
exports.getGroups = exports.createGroup = void 0;
const admin_1 = require("../models/admin");
const createGroup = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { group } = req.body;
    try {
        const admin = yield admin_1.Admin.create({ UserId: req.user.id });
        yield req.user.createGroup({
            name: group,
            adminId: admin.id
        });
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
