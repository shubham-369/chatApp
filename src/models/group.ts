import { DataTypes, Model } from "sequelize";
import sequelize from "../util/database";

interface GroupAttributes extends Model {
    map(arg0: (member: any) => { UserId: any; userName: any; isAdmin: any; }): unknown;
    getMessages: any;
    getUsers: any;
    removeAdmin: any;
    addAdmin: any;
    removeUser: any;
    addUser: any;
    hasUser: any;
    id: number;
    name: string;
}

const Group = sequelize.define<GroupAttributes>('groups', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
});

export { Group };
export type { GroupAttributes };

