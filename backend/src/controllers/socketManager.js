import { Server } from "socket.io";

let connection = {};
let messages = {};
let timeOnline = {};

export const connectToSocket = (server) => {
  const io = new Server(server,{
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
      allowedHeaders: ["*"],
      credentials: true
    }
  });

  io.on("connection", (socket) => {
    socket.on("join-call", (payload) => {
      let roomId = payload;
      
      if (typeof payload === 'object') {
        roomId = payload.roomId;
        socket.username = payload.username;
      }

      if (!connection[roomId]) {
        connection[roomId] = [];
      }

      connection[roomId].push(socket.id);
      timeOnline[socket.id] = new Date();

      for (let i = 0; i < connection[roomId].length - 1; i++) {
        io.to(connection[roomId][i]).emit("user-joined", socket.id, connection[roomId]);
      }

      if (messages[roomId]) {
        messages[roomId].forEach((msg) => {
          io.to(socket.id).emit(
            "chat-message",
            msg.data,
            msg.sender,
            msg["socket-id-sender"]
          );
        });
      }
    });

    socket.on("signal", (toId, message) => {
      io.to(toId).emit("signal", socket.id, message);
    });

    socket.on("chat-message", (data, sender) => {
      const [matchingRoom, found] = Object.entries(connection).reduce(
        ([room, isFound], [roomKey, roomValue]) => {
          if (!isFound && roomValue.includes(socket.id)) {
            return [roomKey, true];
          }
          return [room, isFound];
        },
        ["", false]
      );

      if (found) {
        if (!messages[matchingRoom]) {
          messages[matchingRoom] = [];
        }

        messages[matchingRoom].push({
          data,
          sender,
          "socket-id-sender": socket.id,
        });

        console.log("message:", sender, data);

        connection[matchingRoom].forEach((socketId) => {
          io.to(socketId).emit("chat-message", data, sender, socket.id);
        });
      }
    });

    socket.on("disconnect", () => {
      const diffTime = Math.abs(new Date() - timeOnline[socket.id]);
      let key = null;

      for (const [k, v] of Object.entries(connection)) {
        if (v.includes(socket.id)) {
          key = k;

          v.forEach((socketId) => {
            io.to(socketId).emit("user-left", socket.id);
          });

          connection[key] = v.filter(id => id !== socket.id);

          if (connection[key].length === 0) {
            delete connection[key];
            delete messages[key];
          }
          break;
        }
      }

      delete timeOnline[socket.id];
      console.log("user disconnected:", socket.id, "online time:", diffTime, "ms");
    });

  });

  return io;
};
