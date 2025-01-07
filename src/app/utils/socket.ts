const { Server } = require("socket.io");
// const { createAdapter } = require("@socket.io/redis-adapter");
// const redisClient = require("./redis");

let io;

const initializeSocketIO = (server) => {
  // io = socketIo(server, {
  //   pingTimeout: 60000,
  // });
  io = new Server(server, {
    pingTimeout: 60000,
    cors: {
      origin: "*",
    },
  });
  try {
    // const subClient = redisClient.duplicate();
    // io.adapter(createAdapter(redisClient, subClient));
  } catch (e) {
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

export = {
  initializeSocketIO,
  getIO,
};