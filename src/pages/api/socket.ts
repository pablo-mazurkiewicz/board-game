import type { NextApiRequest, NextApiResponse } from "next";
import { Server as SocketIOServer } from "socket.io";
import type { Socket as NetSocket } from "net";

export const config = {
  api: {
    bodyParser: false,
  },
};

// Define a type for the extended server object
type NextApiResponseWithSocket = NextApiResponse & {
  socket: NetSocket & {
    server: {
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
    const io = new SocketIOServer(res.socket.server as any, {
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
