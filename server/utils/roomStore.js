// In-memory player storage
const rooms = {};

function addPlayer({ socketId, username, roomId }) {
  if (!rooms[roomId]) rooms[roomId] = [];

  // If player already exists (by username), update their socketId
  const existing = rooms[roomId].find((p) => p.username === username);
  if (existing) {
    existing.id = socketId;
    return;
  }

  // Avoid duplicates by socketId
  if (!rooms[roomId].some((p) => p.id === socketId)) {
    rooms[roomId].push({ id: socketId, username, points: 0, guessedCorrectly: false });
  }
}

function removePlayer(socketId) {
  for (const roomId in rooms) {
    rooms[roomId] = rooms[roomId].filter((p) => p.id !== socketId);
    if (rooms[roomId].length === 0) delete rooms[roomId];
  }
}

function getPlayers(roomId) {
  return rooms[roomId] || [];
}

function updatePoints(socketId, delta) {
  for (const room in rooms) {
    const player = rooms[room].find((p) => p.id === socketId);
    if (player) player.points += delta;
  }
}

module.exports = {
  addPlayer,
  removePlayer,
  getPlayers,
  updatePoints,
};
