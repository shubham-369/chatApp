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
exports.signup = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_1 = __importDefault(require("../models/user"));
const signup = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, number, password } = req.body;
    try {
        const existingUser = yield user_1.default.findOne({ where: { email: email } });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exist' });
        }
        const saltRounds = 10;
        const hashedPassword = yield bcrypt_1.default.hash(password, saltRounds);
        yield user_1.default.create({ name, email, number, password: hashedPassword });
        res.status(201).json({ message: 'User created successfully' });
    }
    catch (error) {
        console.log('Error while signup: ', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.signup = signup;
