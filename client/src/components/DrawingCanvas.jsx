import React, { useRef, useEffect, useState } from "react";
import socket from "../socket";

const COLORS = ["black", "red", "green", "blue", "purple", "orange"];

const DrawingCanvas = ({ roomId }) => {
  const canvasRef = useRef(null);
  const isDrawing = useRef(false);
  const prev = useRef({ x: 0, y: 0 });

  // Use refs to avoid re-renders & preserve values
  const selectedColorRef = useRef("black");
  const isEraserRef = useRef(false);

  // Local state for UI only
  const [activeColor, setActiveColor] = useState("black");
  const [eraserActive, setEraserActive] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    canvas.width = 800;
    canvas.height = 600;

    ctx.lineCap = "round";
    ctx.lineWidth = 4;

    const drawLine = (x0, y0, x1, y1, color = "black", emit = false) => {
      ctx.strokeStyle = color;
      ctx.beginPath();
      ctx.moveTo(x0, y0);
      ctx.lineTo(x1, y1);
      ctx.stroke();
      ctx.closePath();

      if (!emit) return;

      socket.emit("drawing", {
        roomId,
        x0,
        y0,
        x1,
        y1,
        color,
      });
    };

    const handleMouseDown = (e) => {
      isDrawing.current = true;
      const rect = canvas.getBoundingClientRect();
      prev.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };

    const handleMouseMove = (e) => {
      if (!isDrawing.current) return;

      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const color = isEraserRef.current ? "white" : selectedColorRef.current;

      drawLine(prev.current.x, prev.current.y, x, y, color, true);
      prev.current = { x, y };
    };

    const handleMouseUp = () => {
      isDrawing.current = false;
    };

    // Event listeners
    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseup", handleMouseUp);
    canvas.addEventListener("mouseleave", handleMouseUp);

    // Socket receive
    socket.on("drawing", ({ x0, y0, x1, y1, color }) => {
      drawLine(x0, y0, x1, y1, color);
    });

    return () => {
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseup", handleMouseUp);
      canvas.removeEventListener("mouseleave", handleMouseUp);
      socket.off("drawing");
    };
  }, [roomId]);

  // Color select handler
  const handleColorSelect = (color) => {
    isEraserRef.current = false;
    selectedColorRef.current = color;
    setActiveColor(color);
    setEraserActive(false);
  };

  const handleEraser = () => {
    isEraserRef.current = true;
    setEraserActive(true);
  };

  return (
    <div className="flex flex-col items-center mt-6">
      {/* Toolbar */}
      <div className="flex gap-2 mb-2">
        {COLORS.map((color) => (
          <button
            key={color}
            onClick={() => handleColorSelect(color)}
            className={`w-8 h-8 rounded-full border-2 ${
              activeColor === color && !eraserActive ? "border-black" : "border-transparent"
            }`}
            style={{ backgroundColor: color }}
          />
        ))}
        <button
          onClick={handleEraser}
          className={`px-3 py-1 text-sm border rounded ${
            eraserActive ? "bg-gray-300" : "bg-white"
          }`}
        >
          Eraser
        </button>
      </div>

      {/* Canvas */}
      <div className="border-2 border-black">
        <canvas ref={canvasRef} className="bg-white cursor-crosshair" />
      </div>
    </div>
  );
};

export default DrawingCanvas;
