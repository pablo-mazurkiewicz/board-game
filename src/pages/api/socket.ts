import { Server as IOServer } from "socket.io";
import type { Server as HTTPServer } from "http";
import type { NextApiRequest, NextApiResponse } from "next";
import type { Socket as NetSocket } from "net";

export const config = {
  api: { bodyParser: false },
};

type NextApiResponseWithSocket = NextApiResponse & {
  socket: NetSocket & {
    server: HTTPServer & {
      io?: IOServer;
    };
  };
};

type Dot = {
  x: number;
  y: number;
  color: string;
};

const dots: Record<string, Dot> = {};

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

      const color = `hsl(${Math.floor(Math.random() * 360)}, 80%, 60%)`;
      dots[socket.id] = { x: 50, y: 50, color };

      socket.emit("dots-update", dots); // Send current state to new client
      socket.broadcast.emit("dots-update", dots); // Let others know

      socket.on("move", ({ x, y }) => {
        dots[socket.id] = { ...dots[socket.id], x, y };
        io.emit("dots-update", dots);
      });

      socket.on("disconnect", () => {
        delete dots[socket.id];
        io.emit("dots-update", dots);
      });
    });

    res.socket.server.io = io;
  }

  res.end();
}
