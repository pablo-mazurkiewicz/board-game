import { useEffect, useRef, useState } from "react";
import io from "socket.io-client";


type MoveData = {
  player: string;
  action: string;
  x: number;
  y: number;
};


export default function Home() {
  const socketRef = useRef<ReturnType<typeof io> | null>(null);
  const [dot, setDot] = useState<{ x: number; y: number } | null>(null);


  useEffect(() => {
    const setupSocket = async () => {
      await fetch("/api/socket");
      const socket = io({ path: "/api/socket" });
      socketRef.current = socket;

      socket.on("connect", () => {
        console.log("✅ Connected:", socket.id);
      });

      socket.on("move", (data: MoveData) => {
        console.log("🎯 Move received:", data);
        setDot({ x: data.x, y: data.y });
      });
    };

    setupSocket();

    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  const sendMove = () => {
  const x = Math.random() * 90; // % from 0 to 90
  const y = Math.random() * 90;

  socketRef.current?.emit("move", {
    player: "me",
    action: "clicked button",
    x,
    y,
  });

  setDot({ x, y });
};

  return (
    <main className="p-8">
      <h1 className="text-xl font-bold mb-4">Board Game Test</h1>
      <button
        onClick={sendMove}
        className="bg-blue-600 text-white px-6 py-2 rounded"
      >
        Click to Send Signal
      </button>

      {dot && (
  <div
    className="w-4 h-4 bg-red-500 rounded-full fixed"
    style={{
      top: `${dot.y}%`,
      left: `${dot.x}%`,
      transform: "translate(-50%, -50%)",
    }}
  />
)}

    </main>
  );
}
