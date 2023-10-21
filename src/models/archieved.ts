import { DataTypes, Model } from "sequelize";
import sequelize from "../util/database";

interface archievedMessageAttributes extends Model{
    id: number;
    message: string;
    file: string | null;
};

const ArchievedMessages = sequelize.define<archievedMessageAttributes>('archievedmessages', {
    id:{
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    message:{
        type: DataTypes.TEXT,
        allowNull: true,
        validate:{
            len:[1, 1000],
        }, 
    },
    file: {
        type: DataTypes.STRING,
        allowNull: true
    },
    UserId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    groupId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    }
});

export type { archievedMessageAttributes };
export { ArchievedMessages };