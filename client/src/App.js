import React, { useState } from "react";
import Lobby from "./pages/Lobby";
import socket from "./socket";
import ChatBox from "./components/ChatBox";
import DrawingCanvas from "./components/DrawingCanvas";

function App() {
  const [inRoom, setInRoom] = useState(false);
  const [username, setUsername] = useState("");
  const [roomId, setRoomId] = useState("");

  const handleJoinRoom = (user, room) => {
    setUsername(user);
    setRoomId(room);
    setInRoom(true);
    socket.emit("join-room", { username: user, roomId: room });
  };

  return (
    <div className="App">
      {!inRoom ? (
        <Lobby onJoin={handleJoinRoom} />
      ) : (
        <div className="flex flex-col items-center">
          <h1 className="mt-10 text-2xl font-semibold">Room: {roomId}</h1>
          <h2 className="text-md mb-2">You are: {username}</h2>
          <ChatBox username={username} roomId={roomId} />
          <DrawingCanvas roomId={roomId} />
        </div>
      )}
    </div>
  );
}

export default App;
