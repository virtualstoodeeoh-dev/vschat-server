const conversationRoute = require("./routes/conversation");
const messageRoute = require("./routes/message");
const mongoose = require("mongoose");

let users = [];
let eServer = null;
let secretKey;

const addUser = (userId, socketId) => {
  if (!users.some((user) => user.userId === userId)) {
    users.push({ userId, socketId });
  } else {
    users.find((user) => user.userId === userId).socketId = socketId;
  }
};

const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
  console.log(users.find((user) => user.userId === userId));
  return users.find((user) => user.userId === userId);
};

exports.init = (express, mongoURI, secret) => {
  eServer = express;
  secretKey = secret;

  if (mongoURI) {
    mongoose.connect("mongodb://localhost:27017/chatAppTest");
  } else {
    throw new Error("MongoDB URI is not provided");
  }
};

exports.listen = (port) => {
  if (!port) {
    throw new Error("Port is not provided");
  }
  if (!eServer) {
    throw new Error("Express is not initialized");
  }

  if (!secretKey) {
    throw new Error("Secret is not initialized");
  }

  const io = require("socket.io")(port, {
    cors: {
      origin: "http://localhost:3000",
    },
  });

  eServer.use("/vsChat/messages", messageRoute);
  eServer.use("/vsChat/conversations", conversationRoute);

  io.on("connection", (socket) => {
    socket.on("addUser", (userId) => {
      addUser(userId, socket.id);
      io.emit("getUsers", users);
      console.log(users);
    });

    socket.on("disconnect", () => {
      removeUser(socket.id);
      io.emit("getUsers", users);
    });

    socket.on("sendMessage", ({ senderId, receiverId, text }) => {
      const user = getUser(receiverId);
      if (user) {
        io.to(user.socketId).emit("getMessage", {
          senderId,
          text,
        });
      }
    });
  });
};
