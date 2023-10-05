"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArchievedMessages = void 0;
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../util/database"));
;
const ArchievedMessages = database_1.default.define('archievedmessages', {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    message: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true,
        validate: {
            len: [1, 1000],
        },
    },
    file: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    UserId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    groupId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    }
});
exports.ArchievedMessages = ArchievedMessages;
