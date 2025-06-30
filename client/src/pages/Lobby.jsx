import React, { useState } from 'react';

const Lobby = ({ onJoin }) => {
  const [username, setUsername] = useState('');
  const [roomId, setRoomId] = useState('');

  const handleJoin = () => {
    if (!username) return alert("Enter username");
    if (!roomId) return alert("Enter room ID to join");
    onJoin(username, roomId);
  };

  const handleCreateRoom = () => {
    if (!username) return alert("Enter username");
    const newRoomId = Math.random().toString(36).substring(2, 8);
    onJoin(username, newRoomId);
  };

  return (
    <div className="flex flex-col items-center mt-20 space-y-4">
      <h2 className="text-3xl font-bold">🎨 Scribble.io Lobby</h2>

      <input
        placeholder="Enter your name"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="border p-2 rounded"
      />

      <input
        placeholder="Room ID (to join)"
        value={roomId}
        onChange={(e) => setRoomId(e.target.value)}
        className="border p-2 rounded"
      />

      <div className="flex space-x-4">
        <button onClick={handleJoin} className="bg-blue-500 text-white px-4 py-2 rounded">
          Join Room
        </button>
        <button onClick={handleCreateRoom} className="bg-green-500 text-white px-4 py-2 rounded">
          Create Room
        </button>
      </div>
    </div>
  );
};

export default Lobby;
