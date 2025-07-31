import { useEffect, useRef } from "react";
import io from "socket.io-client";

type MoveData = {
  player: string;
  action: string;
};

export default function Home() {
  const socketRef = useRef<ReturnType<typeof io> | null>(null);

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
      action: "roll dice",
    });
  };

  return (
    <main className="p-4">
      <h1 className="text-xl font-bold">Board Game</h1>
      <button
        onClick={sendMove}
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
      >
        Send Move
      </button>
    </main>
  );
}
