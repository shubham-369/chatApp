"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = __importDefault(require("crypto"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const secretKey = process.env.JWT_SECRET_KEY || crypto_1.default.randomBytes(32).toString('hex');
function generateToken(user) {
    return jsonwebtoken_1.default.sign({
        userID: user.id,
        email: user.email
    }, secretKey, { expiresIn: '3h' });
}
;
exports.default = generateToken;
