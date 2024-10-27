import { Server, Socket } from "socket.io";
import { AdventureController } from "../controllers/AdventureController";

export default function socketRoutes(io: Server) {
  const adventureController = new AdventureController();

  io.on("connection", (socket: Socket) => {
    console.log("New client connected:", socket.id);

    socket.on("adventure_info", (data) => adventureController.handleStoreGPSData(socket, data));

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });
}
