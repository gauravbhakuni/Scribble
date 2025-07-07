const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
const cors = require("cors");

const {
  startGame,
  initRoom,
  getRoomState,
  roomState,
} = require("./controllers/gameController");

const {
  addPlayer,
  removePlayer,
  getPlayers,
} = require("./utils/roomStore");

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
  console.log("✅ A user connected:", socket.id);

  socket.on("join-room", ({ username, roomId }) => {
    socket.join(roomId);

    // Add player to room store (updates socketId if username exists)
    addPlayer({ socketId: socket.id, username, roomId });

    // Ensure player is in game state with correct structure and socketId
    if (!roomState[roomId]) {
      initRoom(roomId, getPlayers(roomId));
    } else {
      // Update socketId if player exists by username, else add new
      const playerIdx = roomState[roomId].players.findIndex((p) => p.username === username);
      if (playerIdx !== -1) {
        // Preserve points and guessedCorrectly
        const prev = roomState[roomId].players[playerIdx];
        roomState[roomId].players[playerIdx] = {
          ...prev,
          id: socket.id,
        };
      } else {
        roomState[roomId].players.push({
          id: socket.id,
          username,
          points: 0,
          guessedCorrectly: false,
        });
      }
    }

    // --- Ensure all player socket IDs are up to date in game state ---
    // Sync all players in roomState with the latest from getPlayers
    const latestPlayers = getPlayers(roomId);
    roomState[roomId].players = roomState[roomId].players.map((p) => {
      const latest = latestPlayers.find(lp => lp.username === p.username);
      return latest ? { ...p, id: latest.id } : p;
    });

    // Always emit players-update from authoritative game state
    io.to(roomId).emit("players-update", roomState[roomId].players);

    // Start game when 2-4 players
    const players = roomState[roomId].players;
    if (players.length >= 2 && players.length <= 4) {
      // Start the first turn immediately and only emit players-update after start-turn
      startGame(io, roomId);
    }
  });

  socket.on("chat", ({ roomId, username, text }) => {
    io.to(roomId).emit("chat", { username, text });
  });

  socket.on("drawing", ({ roomId, x0, y0, x1, y1, color }) => {
    socket.to(roomId).emit("drawing", { x0, y0, x1, y1, color });
  });

  socket.on("make-guess", ({ roomId, username, text }) => {
    const room = getRoomState(roomId);
    const actualWord = room?.actualWord;

    if (!actualWord) return;

    const guess = text.toLowerCase();
    const correct = actualWord.toLowerCase() === guess;

    if (correct) {
      const players = room.players;
      const player = players.find((p) => p.username === username);

      if (player && !player.guessedCorrectly) {
        player.guessedCorrectly = true;
        player.points += 100;

        io.to(roomId).emit("correct-guess", { username });
        io.to(roomId).emit("players-update", players);
      }
    }

    io.to(roomId).emit("chat", { username, text });
  });

  socket.on("disconnecting", () => {
    const rooms = Array.from(socket.rooms).filter((r) => r !== socket.id);

    for (const roomId of rooms) {
      removePlayer(socket.id);

      // Remove player from game state as well
      if (roomState[roomId]) {
        const prevDrawerId = roomState[roomId].players[roomState[roomId].drawerIndex]?.id;
        roomState[roomId].players = roomState[roomId].players.filter((p) => p.id !== socket.id);
        // Fix drawerIndex if out of bounds
        if (roomState[roomId].drawerIndex >= roomState[roomId].players.length) {
          roomState[roomId].drawerIndex = 0;
        }
        io.to(roomId).emit("players-update", roomState[roomId].players);
        // If the drawer left, start next turn if enough players
        if (prevDrawerId === socket.id && roomState[roomId].players.length >= 2) {
          setTimeout(() => startGame(io, roomId), 1000);
        }
      }
    }
  });

  socket.on("disconnect", () => {
    console.log("❌ A user disconnected:", socket.id);
  });

  socket.on("start-game", ({ roomId }) => {
    // Emit 'start-game' to all clients in the room
    io.to(roomId).emit("start-game");
    // Start the game logic (first turn)
    startGame(io, roomId);
  });
});

// Add this route to check if a room exists
app.get("/api/room-exists/:roomId", (req, res) => {
  const { roomId } = req.params;
  // Room exists if it is in the roomState and has at least one player
  const exists = !!(roomState[roomId] && roomState[roomId].players && roomState[roomId].players.length > 0);
  res.json({ exists });
});

const PORT = 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
