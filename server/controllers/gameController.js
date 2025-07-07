const words = ["apple", "banana", "car", "guitar", "house", "rocket"];

// Per-room game state
const roomState = {}; // { [roomId]: { players, drawerIndex, actualWord, round } }

function startGame(io, roomId) {
  if (!roomState[roomId]) return;

  const state = roomState[roomId];
  const players = state.players;
  if (!players || players.length === 0) return;

  const drawer = players[state.drawerIndex];
  const actualWord = words[Math.floor(Math.random() * words.length)];

  state.actualWord = actualWord;
  state.round = (state.round || 1);
  
  // Reset guess status
  players.forEach(p => {
    p.guessedCorrectly = false;
  });

  io.to(roomId).emit("start-turn", {
    drawerId: drawer.id,
    maskedWord: maskWord(actualWord),
  });

  // Emit players-update at the start of the turn as well
  io.to(roomId).emit("players-update", players);

  io.to(drawer.id).emit("reveal-word", actualWord);

  // Next drawer in future round
  state.drawerIndex = (state.drawerIndex + 1) % players.length;

  // Schedule turn end after 60 seconds
  setTimeout(() => {
    io.to(roomId).emit("reveal-word", actualWord);
    io.to(roomId).emit("players-update", players);
    // Start next turn
    startGame(io, roomId);
  }, 60000); // 60 sec rounds
}

function initRoom(roomId, playerList) {
  roomState[roomId] = {
    players: playerList.map(p => ({
      id: p.socketId,
      username: p.username,
      points: 0,
      guessedCorrectly: false,
    })),
    drawerIndex: 0,
    actualWord: "",
    round: 1,
  };
}

function updatePlayersInRoom(roomId, newPlayers) {
  if (roomState[roomId]) {
    roomState[roomId].players = newPlayers.map(p => ({
      ...p,
      points: p.points || 0,
      guessedCorrectly: p.guessedCorrectly || false,
    }));
  }
}

function getRoomState(roomId) {
  return roomState[roomId];
}

function maskWord(word) {
  // Only mask non-space characters
  return word.replace(/[^\s]/g, "_");
}

module.exports = {
  roomState,
  startGame,
  initRoom,
  getRoomState,
  updatePlayersInRoom,
};
