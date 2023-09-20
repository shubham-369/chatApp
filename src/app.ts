import express  from "express";
import Sequelize from "./util/database";
import { config } from "dotenv";
import cors from "cors";

import UserRoutes from "./routes/user";

config();
const app = express();
app.use(express.json());
app.use(cors());

app.use('/user', UserRoutes);

const port = process.env.PORT || 3000;
Sequelize
    .sync()
    .then(() => {
        app.listen(port);
    })
    .catch(error => {
        console.log('Error while running server!', error);
    })