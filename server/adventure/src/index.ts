import express from 'express';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import testRoutes from './routes/testRoutes';

const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server, {
  path: '/adventure/socket',
});
const port = 8080;

app.use('/adventure/test', testRoutes);

server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});