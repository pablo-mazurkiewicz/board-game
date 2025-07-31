import type { NextApiRequest, NextApiResponse } from "next";
import type { Server as HTTPServer } from "http";
import type { Socket as NetSocket } from "net";
import { Server as SocketIOServer } from "socket.io";

export const config = {
  api: {
    bodyParser: false,
  },
};

// Custom response type with socket.io attached
type NextApiResponseWithSocket = NextApiResponse & {
  socket: NetSocket & {
    server: HTTPServer & {
      io?: SocketIOServer;
    };
  };
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponseWithSocket
) {
  if (!res.socket.server.io) {
    console.log("🧠 Initializing Socket.IO server...");

    const httpServer = res.socket.server;
    const io = new SocketIOServer(httpServer, {
      path: "/api/socket",
    });

    io.on("connection", (socket) => {
      console.log("🔌 Client connected:", socket.id);

      socket.on("move", (data) => {
        socket.broadcast.emit("move", data);
      });
    });

    res.socket.server.io = io;
  } else {
    console.log("♻️ Socket.IO server already running");
  }

  res.end();
}
