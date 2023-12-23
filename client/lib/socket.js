import { io } from "socket.io-client";

const WEBSOCKET_URL = process.env.WEBSOCKET_URL ?? "http://localhost:3002";

export const socket = io(WEBSOCKET_URL);
