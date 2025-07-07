// pages/Home.jsx
import React, { useState } from "react";

const Home = ({ onJoinRoom }) => {
  const [username, setUsername] = useState("");
  const [roomId, setRoomId] = useState("");
  const [mode, setMode] = useState("join");
  const [loading, setLoading] = useState(false);

  const checkRoomExists = async (roomId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/room-exists/${roomId}`);
      const data = await res.json();
      return data.exists;
    } catch {
      return false;
    }
  };

  const handleJoin = async () => {
    if (!username) return alert("Enter username");
    if (!roomId) return alert("Enter room ID");
    setLoading(true);
    const exists = await checkRoomExists(roomId);
    setLoading(false);
    if (!exists) return alert("Room does not exist!");
    onJoinRoom(username, roomId, false);
  };

  const handleCreateRoom = () => {
    if (!username) return alert("Enter username");
    const newRoomId = Math.random().toString(36).substring(2, 8);
    onJoinRoom(username, newRoomId, true);
  };

  return (
    <div className="flex flex-col items-center mt-20 space-y-4">
      <h2 className="text-3xl font-bold">🎨 Scribble.io</h2>

      <input
        placeholder="Enter your name"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="border p-2 rounded"
      />

      <div className="flex space-x-4">
        <button
          onClick={() => setMode("join")}
          className={`px-4 py-2 rounded ${mode === "join" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
        >
          Join Room
        </button>
        <button
          onClick={() => setMode("create")}
          className={`px-4 py-2 rounded ${mode === "create" ? "bg-green-600 text-white" : "bg-gray-200"}`}
        >
          Create Room
        </button>
      </div>

      {mode === "join" && (
        <input
          placeholder="Room ID"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
          className="border p-2 rounded"
        />
      )}

      <div>
        {mode === "join" ? (
          <button
            onClick={handleJoin}
            className="bg-blue-500 text-white px-4 py-2 rounded"
            disabled={loading}
          >
            {loading ? "Checking..." : "Join Room"}
          </button>
        ) : (
          <button
            onClick={handleCreateRoom}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Create Room
          </button>
        )}
      </div>
    </div>
  );
};

export default Home;
