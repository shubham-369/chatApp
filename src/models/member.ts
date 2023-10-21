import { DataTypes, Model } from "sequelize";
import sequelize from "../util/database";
import { UserAttributes } from "./user";

interface MemberAttributes extends Model {
    User: UserAttributes;
    id: number;
    isAdmin: boolean;
}

const Member = sequelize.define<MemberAttributes>('members', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    isAdmin: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    }
});
  

export { Member };
export type { MemberAttributes };

