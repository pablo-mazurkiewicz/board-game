"use client";

import { useEffect, useRef } from "react";
import { getSocket } from "../lib/socket";
import type { MoveData } from "../../types/next";

export default function Page() {
  const socketRef = useRef<Awaited<ReturnType<typeof getSocket>> | null>(null);

  useEffect(() => {
    const init = async () => {
      const socket = await getSocket();
      socketRef.current = socket;

      socket.on("connect", () => {
        console.log("✅ Connected:", socket.id);
      });

      socket.on("move", (data: MoveData) => {
        console.log("📦 Move received:", data);
      });
    };

    init();

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
