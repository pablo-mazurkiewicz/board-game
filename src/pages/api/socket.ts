import type { NextApiRequest, NextApiResponse } from "next";
import type { Server as HTTPServer } from "http";
import type { Socket as NetSocket } from "net";
import { Server as SocketIOServer } from "socket.io";

export const config = {
  api: {
    bodyParser: false,
  },
};

type NextApiResponseWithSocket = NextApiResponse & {
  socket: NetSocket & {
    server: HTTPServer & {
      io?: SocketIOServer;
    };
  };
};

let io: SocketIOServer | undefined;

export default function handler(
  req: NextApiRequest,
  res: NextApiResponseWithSocket
) {
  if (!res.socket.server.io) {
    console.log("🧠 Initializing Socket.IO server...");

    io = new SocketIOServer(res.socket.server as any, {
      path: "/api/socket",
    });

    io.on("connection", (socket) => {
      console.log("🔌 Client connected:", socket.id);

      socket.on("move", (data) => {
        console.log("📤 Broadcasting move to all clients");
        io?.emit("move", data); // ✅ Broadcast to all, including sender
      });
    });

    res.socket.server.io = io;
  } else {
    console.log("♻️ Socket.IO server already running");
  }

  res.end();
}
