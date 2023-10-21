import { Response, NextFunction } from "express";
import { Server as SocketServer } from "socket.io";
import RequestWithUser from "../types";
import { User } from "../models/user";
import { Group } from "../models/group";
import uploadToS3 from "../services/s3Services";
import { Member } from "../models/member";

interface chat{
    File?: any;
    file?: any;
    name?: string;
    groupId: number;
    message?: string;
}

export const addMessage = (io: SocketServer) => {
    return async (req: RequestWithUser, res: Response, next: NextFunction) => {
      const { groupID, message } = req.body;
      const file = req.file;
      try {
        //finding if user is member of a group
        const user = await Member.findOne({
          where: {
            groupId: groupID,
            UserId: req.user.id,
          },
        });
  
        if (!user) {
          return res.status(404).json({ message: 'You are not part of this group anymore!' });
        }
       
        const chatMessage: chat = {
            name: req.user.name,
            groupId: groupID
        }
        const saveMessage: chat = {
            groupId: groupID
        }
        //if request contains file then add file
        if (file) {
            const filename = `${Date.now()}_${req.user.id}_${file.originalname}`;
            const url = await uploadToS3(file, filename);
            chatMessage.File = url;
            saveMessage.file = url;
        }
        //if request contains message then add message
        if (message) {
          chatMessage.message = message;
          saveMessage.message = message;
        }
        io.emit('chat message', chatMessage);
        await req.user.createMessage( saveMessage );
        res.status(201).json({ message: 'Message saved to the database' });

      } catch (error) {
        console.log('Error while storing message: ', error);
        res.status(500).json({ message: 'Internal server error' });
      }
    };
};
  
export const getMessages = async (req:RequestWithUser, res: Response, next: NextFunction) => {
    const { groupID } =  req.query;

    try{
        
        const member = await Member.findOne({
            where: {
                UserId: req.user.id,
                groupId: groupID,
            }
        });

        const isadmin = member?.isAdmin;

        const group = await Group.findByPk(groupID);
        if(!group){
            return res.status(404).json({message: 'Group does not exits anymore!'});
        }
        const messages = await group.getMessages({
            include: [
                {
                    model: User,
                    attributes: ['name'],
                }
            ]
        });
        if(messages.length <= 0 ){
            return res.status(404).json({message: 'No message in the group!', groupDetails: group, isAdmin: isadmin});
        }
        

        res.status(201).json({messages: messages, groupDetails: group, isAdmin: isadmin});
    }catch(error){
        console.log('Error while getting messages: ', error);
        res.status(500).json({ message: 'Internal server error' });        
    }
    
};

export const getByEmail = async ( req:RequestWithUser, res: Response, next: NextFunction ) => {
    const { userEmail } = req.query;
    try {
        const user = await User.findOne({ 
            where: { email: userEmail },
            attributes: ['id', 'name'], 
        });
        if(!user){
            return res.status(404).json({ message: 'No user exist with this email!' });
        }
        res.status(200).json({ user: user });
    } catch (error) {
        console.log('Error while finding user: ', error);
        res.status(500).json({ message: 'Internal server error' });             
    }    
};

export const showGroupUsers = async ( req:RequestWithUser, res: Response, next: NextFunction ) => {
    const { groupID } = req.query;
    try {

        const members = await Group.findByPk(groupID, {
            include: [
              {
                model: User,
                attributes: ['id','name'],
                through: {
                  attributes: ['isAdmin'], 
                },
              },
            ],
          })
        if(!members){
            return res.status(404).json({message: 'No user is added in the group'});
        };
        
        res.status(200).json({users: members});

    } catch (error) {
        console.log('Error while fetching group users: ', error);
        res.status(500).json({ message: 'Internal server error' });                     
    }    
};

