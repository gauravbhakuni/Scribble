import React from "react";
import socket from "../socket";

const PlayerList = ({ players = [], drawerId }) => {
  return (
    <div className="p-2 space-y-2">
      {players.length === 0 && (
        <p className="text-sm text-red-500">No players in room</p>
      )}

      <h2 className="text-lg font-semibold border-b pb-1">Players</h2>
      {players.map((player, index) => {
        const isYou = player.id === socket.id;
        const isDrawing = player.id === drawerId;
        // console.log("playerId:", player.id, "drawerId:", drawerId, "socketId:", socket.id, isYou, isDrawing);

        return (
          <div
            key={player.id}
            className={`flex justify-between items-center px-2 py-1 rounded ${
              player.guessedCorrectly ? "bg-orange-100 font-semibold" : ""
            } ${isDrawing ? "bg-yellow-100" : ""}`}
          >
            <div className="flex items-center gap-1">
              <span>{index + 1}.</span>
              <span>{player.username}</span>
              {isYou && <span className="text-xs text-gray-500">(You)</span>}
              {isDrawing && <span className="text-sm ml-1">✏️</span>}
            </div>
            <span className="text-sm text-gray-700">{player.points} pts</span>
          </div>
        );
      })}
    </div>
  );
};

export default PlayerList;
