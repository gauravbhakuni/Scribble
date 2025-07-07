import React, { useState } from "react";
import socket from "../socket";

const GuessInput = ({ roomId, username, isDrawer, isDisabled }) => {
  const [guess, setGuess] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = guess.trim();
    if (!trimmed || isDrawer || isDisabled) return;

    socket.emit("make-guess", { roomId, username, text: trimmed });
    setGuess(""); // Clear after submit
  };

  if (isDrawer) return null; // Don't show input to the drawer

  return (
    <form onSubmit={handleSubmit} className="mt-auto flex gap-2 p-2">
      <input
        type="text"
        value={guess}
        onChange={(e) => setGuess(e.target.value)}
        placeholder="Type your guess here..."
        className="flex-1 px-3 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
        disabled={isDisabled}
      />
      <button
        type="submit"
        disabled={isDisabled}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
      >
        Send
      </button>
    </form>
  );
};

export default GuessInput;
