import React, { useState, useEffect } from "react";
import Home from "./pages/Home";
import Lobby from "./pages/Lobby";
import Game from "./pages/Game";
import socket from "./socket";

function App() {
  const [stage, setStage] = useState("home"); // "home" | "lobby" | "game"
  const [username, setUsername] = useState("");
  const [roomId, setRoomId] = useState("");
  const [players, setPlayers] = useState([]);
  const [isCreator, setIsCreator] = useState(false);

  useEffect(() => {
    socket.on("players-update", (list) => {
      setPlayers(list);
    });

    socket.on("start-game", () => {
      setStage("game");
    });

    return () => {
      socket.off("players-update");
      socket.off("start-game");
    };
  }, []);

  const handleJoinRoom = (user, room, creator = false) => {
    setUsername(user);
    setRoomId(room);
    setIsCreator(creator);
    setStage("lobby");

    if (socket.connected) {
      socket.emit("join-room", { username: user, roomId: room });
    } else {
      socket.once("connect", () => {
        socket.emit("join-room", { username: user, roomId: room });
      });
    }
  };

  const handleStartGame = () => {
    if (players.length >= 2) {
      socket.emit("start-game", { roomId });
    } else {
      alert("At least 2 players required to start.");
    }
  };

  return (
    <div className="min-h-screen">
      {stage === "home" && <Home onJoinRoom={handleJoinRoom} />}
      {stage === "lobby" && (
        <Lobby
          roomId={roomId}
          username={username}
          players={players}
          isCreator={isCreator}
          onStartGame={handleStartGame}
        />
      )}
      {stage === "game" && <Game roomId={roomId} username={username} />}
    </div>
  );
}

export default App;
