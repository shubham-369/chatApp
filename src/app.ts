
import { config } from "dotenv";
config();
import express  from "express";
const app = express();
import Sequelize from "./util/database";
import cors from "cors";
import http from "http";
import initializeSocket from "./util/socket";
import cron from "node-cron";
import CronJobService from "./services/cronJob";

import UserRoutes from "./routes/user";
import GroupRoutes from "./routes/group";

import { User } from "./models/user";
import { Message } from "./models/message";
import { Group } from "./models/group";
import { Member } from "./models/member";

const httpServer = http.createServer(app);
const io = initializeSocket(httpServer);

app.use(express.json());
app.use(
    cors({
        origin: '*',
        credentials: true,
    })
);
app.use(express.static('public'));

import MessageRoutes from "./routes/message";
app.use('/user', UserRoutes);
app.use('/user', GroupRoutes);
app.use('/user', MessageRoutes(io));

cron.schedule('0 0 * * *', async () => {
    try {
        await CronJobService.runJob();        
    } catch (error) {
        console.log('Error in cron job schedule', error);
    }
}, {
    timezone: 'Asia/Kolkata',
});



User.hasMany(Message);
Message.belongsTo(User);

User.belongsToMany(Group, { through: Member});
Group.belongsToMany(User, { through: Member});

Group.hasMany(Message, { constraints: true, onDelete: 'CASCADE' });
Message.belongsTo(Group);


const port = process.env.PORT || 3000;
Sequelize
    .sync()
    .then(() => {
        httpServer.listen(port);
    })
    .catch(error => {
        console.log('Error while running server!', error);
    })
    