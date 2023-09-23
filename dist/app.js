"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const express_1 = __importDefault(require("express"));
const database_1 = __importDefault(require("./util/database"));
const cors_1 = __importDefault(require("cors"));
const user_1 = __importDefault(require("./routes/user"));
const message_1 = __importDefault(require("./routes/message"));
const group_1 = __importDefault(require("./routes/group"));
const user_2 = require("./models/user");
const message_2 = require("./models/message");
const group_2 = require("./models/group");
const junction_1 = require("./models/junction");
const admin_1 = require("./models/admin");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: '*',
    credentials: true,
}));
app.use('/user', user_1.default);
app.use('/user', group_1.default);
app.use('/user', message_1.default);
group_2.Group.hasMany(message_2.Message);
message_2.Message.belongsTo(group_2.Group);
admin_1.Admin.hasOne(group_2.Group);
group_2.Group.belongsTo(admin_1.Admin);
user_2.User.hasMany(message_2.Message, { constraints: true, onDelete: 'CASCADE' });
message_2.Message.belongsTo(user_2.User);
user_2.User.belongsToMany(group_2.Group, { through: junction_1.Junction });
group_2.Group.belongsToMany(user_2.User, { through: junction_1.Junction });
user_2.User.hasMany(admin_1.Admin);
admin_1.Admin.belongsTo(user_2.User);
const port = process.env.PORT || 3000;
database_1.default
    .sync()
    .then(() => {
    app.listen(port);
})
    .catch(error => {
    console.log('Error while running server!', error);
});
