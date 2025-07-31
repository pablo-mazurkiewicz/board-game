const express = require("express");
const next = require("next");
const { createServer } = require("http");
const { Server } = require("socket.io");

const port = process.env.PORT || 3000;
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();
  const httpServer = createServer(server);
  const io = new Server(httpServer, {
    path: "/api/socket",
  });

  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);
    socket.on("move", (data) => {
      socket.broadcast.emit("move", data);
    });
  });

  server.all("*", (req, res) => {
    return handle(req, res);
  });

  httpServer.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`);
  });
});
