const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("join-room", ({ username, roomId }) => {
    socket.join(roomId);
    console.log(`${username} joined room: ${roomId}`);

    socket.to(roomId).emit("user-joined", username);
  });

  socket.on("chat", ({ roomId, username, text }) => {
    io.to(roomId).emit("chat", { username, text });
  });

  socket.on("drawing", ({ roomId, x0, y0, x1, y1, color }) => {
    socket.to(roomId).emit("drawing", { x0, y0, x1, y1, color });
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
  });
});

const PORT = 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
