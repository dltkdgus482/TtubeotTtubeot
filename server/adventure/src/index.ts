import express from 'express';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';

const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server, {
  path: '/adventure/socket',
});
const port = 8080;

server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});