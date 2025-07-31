import { useEffect, useRef, useState } from "react";
import io from "socket.io-client";

type MoveData = {
  player: string;
  action: string;
};

export default function Home() {
  const socketRef = useRef<ReturnType<typeof io> | null>(null);
  const [dotVisible, setDotVisible] = useState(false);

  useEffect(() => {
    const setupSocket = async () => {
      await fetch("/api/socket");
      const socket = io({ path: "/api/socket" });
      socketRef.current = socket;

      socket.on("connect", () => {
        console.log("✅ Connected:", socket.id);
      });

      socket.on("move", (data: MoveData) => {
        console.log("🎲 Move received:", data);
        setDotVisible(true); // ✅ show red dot on message
      });
    };

    setupSocket();

    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  const sendMove = () => {
    socketRef.current?.emit("move", {
      player: "me",
      action: "clicked button",
    });
    setDotVisible(true); // ✅ show dot locally too
  };

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">Board Game Test</h1>
      <button
        onClick={sendMove}
        className="bg-blue-600 text-white px-6 py-2 rounded"
      >
        Click to Send Signal
      </button>

      {dotVisible && (
        <div className="w-4 h-4 mt-6 rounded-full bg-red-600 animate-pulse" />
      )}
    </main>
  );
}
