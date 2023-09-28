"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_1 = require("socket.io");
function initializeSocket(server) {
    const io = new socket_io_1.Server(server);
    io.on('connection', (socket) => {
        console.log('A user connected!');
        socket.on('disconnect', () => {
            console.log('A user disconnected');
        });
    });
    return io;
}
exports.default = initializeSocket;
