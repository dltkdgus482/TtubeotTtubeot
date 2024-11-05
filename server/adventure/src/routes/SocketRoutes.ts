import { Server, Socket } from "socket.io";
import { AdventureController } from "../controllers/AdventureController";
import MQController from "../controllers/MQController";

export default function socketRoutes(io: Server) {
  let userMap: Map<number, Socket> = new Map();

  const adventureController = new AdventureController(userMap);
  const mqController = new MQController(userMap);

  io.on("connection", (socket: Socket) => {
    console.log("New client connected:", socket.id);

    socket.on("adventure_init", (data) => adventureController.handleInitAdventure(socket, data));

    socket.on("adventure_info", (data) => adventureController.handleStoreGPSData(socket, data));

    socket.on("adventure_request", (data) => adventureController.handleGreetRequest(socket, data));

    socket.on("adventure_confirm", (data) => adventureController.handleConfirmRequest(socket, data));

    socket.on("adventure_end", () => adventureController.handleEndAdventure(socket));

    socket.on("disconnect", () => adventureController.handleDisconnect(socket));
  });
}
