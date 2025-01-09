const { Server } = require("socket.io");
import { Server as HttpServer } from "http";
import { Server as SocketIOServer, Socket } from "socket.io";
// const { createAdapter } = require("@socket.io/redis-adapter");
// const redisClient = require("./redis");

let io: SocketIOServer;

interface InitializeSocketIO {
  (server: HttpServer): SocketIOServer;
}

const initializeSocketIO: InitializeSocketIO = (server) => {
  io = new Server(server, {
    pingTimeout: 60000,
    cors: {
      origin: "*",
    },
  });
  try {
    // const subClient = redisClient.duplicate();
    // io.adapter(createAdapter(redisClient, subClient));
  } catch (e: any) {
    console.log(e.message);
  }

  // You can add your Socket.IO event listeners here.
  // For example:
  // io.on("connection", (socket) => {
  //   console.log("A user connected");
  // });

  return io;
};

const getIO = () => {
  if (!io) {
    throw new Error("Socket.IO is not initialized");
  }
  return io;
};

export {
  initializeSocketIO,
  getIO,
};