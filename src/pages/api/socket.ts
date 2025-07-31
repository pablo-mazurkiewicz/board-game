import { Server as NetServer } from "http";
import { NextApiRequest, NextApiResponse } from "next";
import { Server as SocketIOServer } from "socket.io";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!(res.socket as any).server.io) {
    console.log("🧠 Initializing Socket.IO server...");
    const io = new SocketIOServer((res.socket as any).server, {
      path: "/api/socket",
    });

    io.on("connection", (socket) => {
      console.log("🔌 Client connected:", socket.id);

      socket.on("move", (data) => {
        console.log("🎯 Received move:", data);
        socket.broadcast.emit("move", data);
      });

      socket.on("disconnect", () => {
        console.log("❌ Client disconnected:", socket.id);
      });
    });

    (res.socket as any).server.io = io;
  }

  res.end();
}
