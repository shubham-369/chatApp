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
const user_1 = require("../models/user");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authenticate = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.header("Authorization");
    if (!token) {
        return res.status(401).json({ message: 'Authentication Failed Token is missing!' });
    }
    try {
        const secretKey = process.env.JWT_SECRET_KEY;
        const decoded = jsonwebtoken_1.default.verify(token, secretKey);
        const user = yield user_1.User.findByPk(decoded.userID);
        if (!user) {
            return res.status(404).json({ message: 'Authentication Failed User does not exist!' });
        }
        req.user = user;
        next();
    }
    catch (error) {
        console.log('Error while authentication!', error);
        res.status(500).json({ message: 'Authorization Error' });
    }
});
exports.default = authenticate;
