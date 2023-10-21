import { User } from "../models/user";
import jwt, {JwtPayload} from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import RequestWithUser from "../types";

const authenticate = async ( req: RequestWithUser, res: Response, next: NextFunction ) => {
    const token  = req.header("Authorization");
    if(!token){
        return res.status(401).json({message: 'Authentication Failed Token is missing!'});
    }
    try{
        const secretKey = process.env.JWT_SECRET_KEY as string;
        const decoded = jwt.verify(token, secretKey) as JwtPayload;
        const user = await User.findByPk(decoded.userID);
        if(!user){
            return res.status(404).json({message: 'Authentication Failed User does not exist!'});
        }
        req.user = user;
        next();
    }
    catch(error){
        console.log('Error while authentication!', error);
        res.status(500).json({message: 'Authorization Error'});
    }
};

export default authenticate;