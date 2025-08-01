import { useEffect, useRef, useState } from "react";
import io from "socket.io-client";

// A dot represents a user's position and color
type Dot = {
  x: number;
  y: number;
  color: string;
};

export default function Home() {
  const socketRef = useRef<ReturnType<typeof io> | null>(null);
  const [dots, setDots] = useState<Record<string, Dot>>({});

  useEffect(() => {
    const setupSocket = async () => {
      await fetch("/api/socket"); // Ensure the server starts
      const socket = io({ path: "/api/socket" });
      socketRef.current = socket;

      socket.on("connect", () => {
        console.log("✅ Connected:", socket.id);
      });

      // Receive updated list of all dots
      socket.on("dots-update", (incomingDots: Record<string, Dot>) => {
        setDots(incomingDots);
      });
    };

    setupSocket();

    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  const sendMove = () => {
    const x = Math.random() * 90;
    const y = Math.random() * 90;

    socketRef.current?.emit("move", { x, y });
  };

  return (
    <main className="p-8">
      <h1 className="text-xl font-bold mb-4">Board Game Test</h1>
      {/* Background image */}
  <div
    className="absolute inset-0 bg-cover bg-center z-0"
    style={{ backgroundImage: `url('/images/board.jpg')` }}
  />

  {/* Your actual game UI goes on top */}
  <div className="relative z-10 p-8">
    <h1 className="text-xl font-bold mb-4 text-white">Dune Board Game</h1>
    <button className="bg-blue-600 text-white px-6 py-2 rounded">Do Action</button>
      <button
        onClick={sendMove}
        className="bg-blue-600 text-white px-6 py-2 rounded"
      >
        Click to Move Your Dot
      </button>

      {/* Render all dots from all users */}
      {Object.entries(dots).map(([id, dot]) => (
        <div
          key={id}
          className="w-4 h-4 rounded-full fixed"
          style={{
            backgroundColor: dot.color,
            top: `${dot.y}%`,
            left: `${dot.x}%`,
            transform: "translate(-50%, -50%)",
          }}
        />
      ))}
      </div>
    </main>
  );
}
