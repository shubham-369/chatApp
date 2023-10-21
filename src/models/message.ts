import { DataTypes, Model } from "sequelize";
import sequelize from "../util/database";

interface messageAttributes extends Model{
    id: number;
    message: string;
    file: string | null;
};

const Message = sequelize.define<messageAttributes>('messages', {
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
    }
});

export type { messageAttributes };
export { Message };