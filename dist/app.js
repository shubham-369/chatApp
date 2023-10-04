"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const database_1 = __importDefault(require("./util/database"));
const cors_1 = __importDefault(require("cors"));
const http_1 = __importDefault(require("http"));
const socket_1 = __importDefault(require("./util/socket"));
const user_1 = __importDefault(require("./routes/user"));
const group_1 = __importDefault(require("./routes/group"));
const user_2 = require("./models/user");
const message_1 = require("./models/message");
const group_2 = require("./models/group");
const member_1 = require("./models/member");
const httpServer = http_1.default.createServer(app);
const io = (0, socket_1.default)(httpServer);
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: '*',
    credentials: true,
}));
app.use(express_1.default.static('public'));
const message_2 = __importDefault(require("./routes/message"));
app.use('/user', user_1.default);
app.use('/user', group_1.default);
app.use('/user', (0, message_2.default)(io));
user_2.User.hasMany(message_1.Message);
message_1.Message.belongsTo(user_2.User);
user_2.User.belongsToMany(group_2.Group, { through: member_1.Member });
group_2.Group.belongsToMany(user_2.User, { through: member_1.Member });
group_2.Group.hasMany(message_1.Message, { constraints: true, onDelete: 'CASCADE' });
message_1.Message.belongsTo(group_2.Group);
const port = process.env.PORT || 3000;
database_1.default
    .sync()
    .then(() => {
    httpServer.listen(port);
})
    .catch(error => {
    console.log('Error while running server!', error);
});
