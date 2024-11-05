import { Server, Socket } from "socket.io";
import { AdventureController } from "../controllers/AdventureController";

export default function socketRoutes(io: Server) {
  const adventureController = new AdventureController();

  io.on("connection", (socket: Socket) => {
    console.log("New client connected:", socket.id);

    socket.on("adventure_init", (data) => adventureController.handleInitAdventure(socket, data));

    socket.on("adventure_info", (data) => adventureController.handleStoreGPSData(socket, data));

    socket.on("adventure_request", (data) => adventureController.handleGreetRequest(socket, data));

    socket.on("adventure_end", () => adventureController.handleEndAdventure(socket));

    socket.on("disconnect", () => adventureController.handleDisconnect(socket));
  });
}
