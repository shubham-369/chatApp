"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GroupAdmins = void 0;
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../util/database"));
const GroupAdmins = database_1.default.define('groupadmins', {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
});
exports.GroupAdmins = GroupAdmins;
