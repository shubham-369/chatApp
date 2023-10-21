import jwt from "jsonwebtoken";
import { UserAttributes } from "../models/user";

const secretKey =  process.env.JWT_SECRET_KEY as string;

function generateToken (user: UserAttributes){
    return jwt.sign(
        {
            userID: user.id,
            email: user.email
        },
        secretKey,
        {expiresIn: '3h'},
    );
};

export default generateToken;