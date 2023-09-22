"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const secretKey = process.env.JWT_SECRET_KEY;
function generateToken(user) {
    return jsonwebtoken_1.default.sign({
        userID: user.id,
        email: user.email
    }, secretKey, { expiresIn: '1h' });
}
;
exports.default = generateToken;
