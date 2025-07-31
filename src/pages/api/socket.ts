import type { NextApiRequest, NextApiResponse } from "next";
import { Server as IOServer } from "socket.io";
import type { Server as HTTPServer } from "http";
import type { Socket as NetSocket } from "net";

export const config = {
  api: {
    bodyParser: false,
  },
};

// Attach Socket.IO server to Next.js response object
type NextApiResponseWithSocket = NextApiResponse & {
  socket: NetSocket & {
    server: HTTPServer & {
      io?: IOServer;
    };
  };
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponseWithSocket
) {
  if (!res.socket.server.io) {
    console.log("🧠 Initializing Socket.IO server...");

    const io = new IOServer(res.socket.server as HTTPServer, {
      path: "/api/socket",
    });

    io.on("connection", (socket) => {
      console.log("🔌 Client connected:", socket.id);

      socket.on("move", (data) => {
        io.emit("move", data); // send to everyone including sender
      });
    });

    res.socket.server.io = io;
  }

  res.end();
}
