import express from 'express';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import testRoutes from './routes/TestRoutes';
import parkRoutes from './routes/ParkRoutes';
import reportRoutes from './routes/ReportRoutes';
import configureGpsRoutes from './routes/SocketRoutes';

const app = express();
const server = http.createServer(app);
const port = 8080;

const io = new SocketIOServer(server, {
  path: '/adventure/socket.io',
});
configureGpsRoutes(io);

app.get('/adventure/healthz', (req, res) => {
  res.status(200).send('OK');
});

app.use('/adventure/test', testRoutes);

app.use('/adventure/parks', parkRoutes);

app.use('/adventure/reports', reportRoutes);

server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});