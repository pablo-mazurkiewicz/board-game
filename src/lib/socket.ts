import { io } from "socket.io-client";

let socket: ReturnType<typeof io> | null = null;

export const getSocket = async () => {
  if (!socket) {
    await fetch("/api/socket");
    socket = io({ path: "/api/socket" });
  }
  return socket;
};
