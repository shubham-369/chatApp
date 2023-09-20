import { Sequelize } from "sequelize";

const sequelize = new Sequelize('chatapp', 'root', 'r333@666m999', {
    dialect: 'mysql',
    host: 'localhost'
});

export default sequelize;
