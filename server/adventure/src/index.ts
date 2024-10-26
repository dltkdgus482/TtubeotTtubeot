import express from 'express';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import testRoutes from './routes/TestRoutes';
import parkRoutes from './routes/ParkRoutes';

const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server, {
  path: '/adventure/socket',
});
const port = 8080;

app.use('/adventure/test', testRoutes);

app.use('/adventure/parks', parkRoutes);

server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});