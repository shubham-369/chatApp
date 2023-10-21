import { DataTypes, Model } from "sequelize";
import sequelize from "../util/database";

interface UserAttributes extends Model {
    admins: any;
    id: number;
    name: string;
    email: string;
    number: string;
    password: string;
}

const User = sequelize.define<UserAttributes>('Users', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    number: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

export { User };
export type { UserAttributes };

