import React, { useEffect, useState } from "react";
import socket from "../socket";

const ChatBox = ({ username, roomId }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    socket.on("chat", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      socket.off("chat");
    };
  }, []);

  const sendMessage = () => {
    if (!input.trim()) return;
    const message = {
      username,
      roomId,
      text: input.trim(),
    };
    socket.emit("chat", message);
    setInput("");
  };

  return (
    <div className="w-full max-w-lg p-4 border rounded mt-6">
      <div className="h-60 overflow-y-auto border-b mb-2 p-2">
        {messages.map((msg, i) => (
          <p key={i}><strong>{msg.username}:</strong> {msg.text}</p>
        ))}
      </div>

      <div className="flex">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          className="flex-1 border p-2 rounded-l"
          placeholder="Type your message..."
        />
        <button onClick={sendMessage} className="bg-blue-600 text-white px-4 rounded-r">
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatBox;
