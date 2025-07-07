import React, { useEffect, useState, useRef } from "react";
import socket from "../socket";
import ChatBox from "../components/ChatBox";
import DrawingCanvas from "../components/DrawingCanvas";
import PlayerList from "../components/PlayerList";
import GuessInput from "../components/GuessInput";

const Game = ({ roomId, username }) => {
  const [drawerId, setDrawerId] = useState(null);
  const [maskedWord, setMaskedWord] = useState("");
  const [actualWord, setActualWord] = useState("");
  const [players, setPlayers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(null); // null until timer starts
  const timerRef = useRef(null);
  const [ready, setReady] = useState(false); // Only show UI when ready

  useEffect(() => {
    // Set up socket listeners once
    const handlePlayersUpdate = (list) => {
      setPlayers(list);
    };

    const handleCorrectGuess = ({ username }) => {
      setPlayers((prev) =>
        prev.map((p) =>
          p.username === username ? { ...p, guessedCorrectly: true } : p
        )
      );
    };

    const handleStartTurn = ({ drawerId, maskedWord }) => {
      setDrawerId(drawerId);
      setMaskedWord(maskedWord);
      setActualWord("");
      setTimeLeft(60);
      setReady(true); // Mark as ready to show UI

      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    };

    const handleRevealWord = (word) => {
      setActualWord(word);
    };

    socket.on("players-update", handlePlayersUpdate);
    socket.on("correct-guess", handleCorrectGuess);
    socket.on("start-turn", handleStartTurn);
    socket.on("reveal-word", handleRevealWord);

    return () => {
      socket.off("players-update", handlePlayersUpdate);
      socket.off("correct-guess", handleCorrectGuess);
      socket.off("start-turn", handleStartTurn);
      socket.off("reveal-word", handleRevealWord);
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []); // Only run once on mount

  if (!ready) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl font-semibold text-gray-600">
          Waiting for game to start...
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row h-screen px-4 md:px-24">
      {/* Left: Player List */}
      <div className="w-full md:w-1/5 bg-blue-200 p-2 overflow-y-auto">
        <PlayerList players={players} drawerId={drawerId} />
      </div>

      {/* Center: Canvas & Word Info */}
      <div className="w-full md:w-3/5 bg-gray-100 flex flex-col px-2">
        <div className="w-full bg-white shadow-md py-4 px-6 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
          <div>
            <h1 className="text-lg sm:text-xl font-semibold">Room: {roomId}</h1>
            <h2 className="text-sm text-gray-600">You are: {username}</h2>
          </div>
          <div>
            <p className="text-base sm:text-lg font-bold">
              Word: {actualWord || maskedWord}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm sm:text-md font-mono bg-gray-100 px-2 py-1 rounded">
              ⏱ Time Left: {timeLeft}s
            </p>
          </div>
        </div>

        <div className="flex-1 w-full flex items-center justify-center bg-gray-200">
          <DrawingCanvas roomId={roomId} canDraw={socket.id === drawerId} />
        </div>
      </div>

      {/* Right: Chat + Guess Input */}
      <div className="w-full md:w-1/4 border-l flex flex-col">
        <div className="flex-1 overflow-y-auto">
          <ChatBox username={username} roomId={roomId} />
        </div>
        <GuessInput
          roomId={roomId}
          username={username}
          isDrawer={socket.id === drawerId}
        />
      </div>
    </div>
  );
};

export default Game;
