import { Server, Socket } from "socket.io";
import { AdventureController } from "../controllers/AdventureController";

export default function socketRoutes(io: Server) {
  const adventureController = new AdventureController();

  io.on("connection", (socket: Socket) => {
    console.log("New client connected:", socket.id);

    socket.on("adventure_init", (data) => adventureController.handleInitAdventure(socket, data));

    socket.on("adventure_info", (data) => adventureController.handleStoreGPSData(socket, data));

    // TODO: adventure_claim 이벤트 추가

    // TODO: adventure_greet 이벤트 추가

    socket.on("adventure_end", () => adventureController.handleEndAdventure(socket));

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });
}
