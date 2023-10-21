import { Server as SocketServer } from "socket.io";

function initializeSocket(server: any) {
  const io = new SocketServer(server);

  io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('disconnect', () => {
      console.log('A user disconnected');
    });
  });
  
  return io;
}

export default initializeSocket;
