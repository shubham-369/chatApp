import { Response, NextFunction } from "express";
import RequestWithUser from "../types";
import { User } from "../models/user";
import { Member } from "../models/member";
import { Group } from "../models/group";
import sequelize from "../util/database";


export const createGroup = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    const { group } = req.body;
    try {
        const groupDetails = await Group.create({name: group});
        const member = await Member.create({
            UserId: req.user.id,
            groupId: groupDetails.id,
            isAdmin: true,
        })

        res.sendStatus(200);
    } catch (error) {
        console.error('Error while creating group', error);
        res.status(500).json({ message: 'Internal server error!' });
    }
};


export const getGroups = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
        const groups = await req.user.getGroups();
        if(groups.length <= 0){
            return res.status(404).json({message: 'You are not part of any group'});
        }
        res.status(201).json(groups);

    } catch (error) {
        console.error('Error while getting groups', error);
        res.status(500).json({message: 'Internal server error!'});      
    }
};

export const addGroupUser = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    const { userID, groupID } = req.body;
    try {
        const [ user, group ] = await Promise.all([
            User.findByPk(userID),
            Group.findByPk(groupID)
        ])
        if (!user || !group) {
            return res.status(404).json({ message: user? 'User not found' : 'Group not found'});
        }
        
        const exist = await group.hasUser(user);
        if(exist){
            return res.status(200).json({message: 'User already added to group!'});
        }
        await Member.create({
            UserId: user.id,
            groupId: group.id,
        })
        
        res.status(200).json({ message: 'User added to group' });
    } catch (error) {        
        console.error('Error while Adding user to group', error);
        res.status(500).json({ message: 'Internal server error'});      
    }    
};

export const removeUser = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    const {groupID, deleteID} = req.query;
    const t = await sequelize.transaction();
    try {
        const rowsDeleted =  await Member.destroy({
            where: {
                UserId: deleteID,
                groupId: groupID,
            },
            transaction: t,
        });

        if (rowsDeleted === 0) {
            await t.rollback();
            return res.status(404).json({ message: 'User not found in the group' });
        };

        const members = await Member.findAll({
            where: {
                groupId: groupID,
            },
            transaction: t,
        });
        if(members.length === 0) {
            await Group.destroy({ 
                where: {
                    id: groupID,
                },
                transaction: t,
            })
        }
        await t.commit();
        res.status(200).json({message: 'User removed from group'});

    } catch (error) {
        await t.rollback();
        console.error('Error while removing user from group', error);
        res.status(500).json({ message: 'Internal server error'});             
    }    
};

export const removeAdmin = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    const { groupID, userID } = req.query;
    try {

        const member = await Member.findOne({
            where: {
                UserId: userID,
                groupId: groupID,
            }
        });
        if(!member){
            return res.status(404).json({message: 'Member does not exist in this group!'});
        }
        await member.update({isAdmin: false});

        const group = await Group.findByPk(groupID);

        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }

        const remainingAdmins = await Member.findAll({
            where: {
                groupId: groupID,
                isAdmin: true,
            }
        });

        if (remainingAdmins.length === 0) {
            await group.destroy();
            return res.status(200).json({ message: 'Group destroyed due to last admin removal' });
        }


        res.status(200).json({message: 'demote to user!'});
        
    } catch (error) {
        console.log('Error while making user admin!', error);
        res.status(500).json({message: 'Internal Server Error'});
    }    
};

export const makeAdmin = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    const { groupID, userID } = req.query;
    try {

        const member = await Member.findOne({
            where: {
                UserId: userID,
                groupId: groupID,
            }
        });
        if(!member){
            return res.status(404).json({message: 'Member does not exist in group!'});
        }
        await member.update({isAdmin: true});

        res.status(200).json({message: 'promoted to admin!'});
    } catch (error) {
        console.log('Error while making user admin!', error);
        res.status(500).json({message: 'Internal Server Error'});
    }    
};