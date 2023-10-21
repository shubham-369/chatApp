import { Request, Response, NextFunction } from 'express';
import bcrypt from "bcrypt";
import { User } from "../models/user";
import generateToken from "../util/jwt";

export const signup = async (req: Request, res: Response, next: NextFunction) => {
    const {name, email, number, password} = req.body;
    try {
        const existingUser = await User.findOne({where: {email: email}});
        if(existingUser){
            return res.status(400).json({message: 'User already exist'});
        }
        
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        
        await User.create({ name, email, number, password: hashedPassword });

        res.status(201).json({ message: 'User created successfully' });
        
    } catch (error) {
        console.log('Error while signup: ', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
    const {email, password} = req.body;
    try{
        const user = await User.findOne({where: {email: email}});
        
        if(!user){
            return res.sendStatus(404);
        }
        const compare = await bcrypt.compare(password, user.password);
        
        if(compare){
            const generatedToken = generateToken(user);
            res.status(200).json({message: 'Login successfull', token: generatedToken});
        }else{
            return res.sendStatus(401);
        }
    }
    catch(error){
        console.log('Error while login: ', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

