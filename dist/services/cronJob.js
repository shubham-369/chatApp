"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
const archieved_1 = require("../models/archieved");
const message_1 = require("../models/message");
class CronJobService {
    runJob() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const messages = yield message_1.Message.findAll();
                const archivedMessages = messages.map((message) => {
                    // Use Object.assign to create a copy of the message without the 'id' property
                    const _a = message.toJSON(), { id } = _a, archivedData = __rest(_a, ["id"]); // Remove 'id' property
                    return archivedData;
                });
                yield archieved_1.ArchievedMessages.bulkCreate(archivedMessages);
                yield message_1.Message.destroy({ where: {} });
            }
            catch (error) {
                console.log('Error while running cron job service', error);
            }
        });
    }
}
exports.default = new CronJobService();
