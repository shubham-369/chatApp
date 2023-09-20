"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const sequelize = new sequelize_1.Sequelize('chatapp', 'root', 'r333@666m999', {
    dialect: 'mysql',
    host: 'localhost'
});
exports.default = sequelize;
