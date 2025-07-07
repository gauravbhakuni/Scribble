// pages/Lobby.jsx
import React from "react";

const Lobby = ({ roomId, username, players, isCreator, onStartGame }) => {
  return (
    <div className="flex flex-col items-center mt-10 space-y-4">
      <h1 className="text-2xl font-bold">Room ID: {roomId}</h1>
      <p className="text-md">Welcome, {username}</p>

      <div className="border p-4 rounded w-full max-w-sm bg-white">
        <h2 className="font-semibold text-lg mb-2">Players:</h2>
        <ul className="space-y-1">
          {players.map((p) => (
            <li
              key={p.id}
              className="flex justify-between items-center bg-gray-100 px-3 py-1 rounded"
            >
              <span>{p.username}</span>
            </li>
          ))}
        </ul>
      </div>

      {isCreator && (
        <button
          onClick={onStartGame}
          disabled={players.length < 2}
          className="mt-4 px-6 py-2 bg-green-600 text-white rounded disabled:opacity-50"
        >
          Start Game
        </button>
      )}
    </div>
  );
};

export default Lobby;
