import { Sequelize } from "sequelize";

const sequelize = new Sequelize( process.env.DB_NAME as string, process.env.DB_USERNAME as string, process.env.DB_PASSWORD as string, {
    dialect: 'mysql',
    host: process.env.DB_HOST as string
});

export default sequelize;
