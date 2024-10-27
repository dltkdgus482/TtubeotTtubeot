import { Socket } from "socket.io";
import AdventureService from "../services/AdventureService";
import AdventureLogModel from '../models/AdventureLogModel';
import JWTParser from '../utils/JWTParser';

export class AdventureController {
  private adventureService: AdventureService;
  private connectedUsers: Map<string, AdventureLogModel> = new Map();

  constructor() {
    this.adventureService = new AdventureService();
  }

  async handleInitAdventure(socket: Socket, data: { token: string }): Promise<void> {
    const { token } = data;
    try {
      let userId = JWTParser.parseUserIdFromJWT(token);
      if (userId === -1) {
        throw new Error('Invalid JWT token');
      }

      let adventureLogModel = AdventureLogModel.create({ userId, userTtubeotOwnershipId: 0 }); // TODO: 현재는 userTtubeotOwnershipId를 0으로 설정, 추후 user 서비스와 연동하여 수정해야 함.
      this.connectedUsers.set(socket.id, adventureLogModel);

      await this.adventureService.initAdventure(adventureLogModel);
    } catch (error) {
      console.error("Error in handleInitAdventure:", error);
      socket.emit("error", { message: "Failed to initialize adventure" });
    }
  }

  // 위치 및 걸음 수 저장 이벤트 처리
  async handleStoreGPSData(socket: Socket, data: { lat: number, lng: number, steps: number }): Promise<void> {
    const userId = this.connectedUsers.get(socket.id)?.userId ?? -1;
    if (userId === -1) {
      socket.emit("error", { message: "Failed to store GPS data" });
      return;
    }
    console.log("handleStoreGPSData:", data);
    console.log("userId:", userId);

    const { lat, lng, steps } = data;
    try {
      let nearbyUsers = await this.adventureService.storeGPSData(userId, lat, lng, steps);

      socket.emit("adventure_user", { "users": nearbyUsers });
    } catch (error) {
      console.error("Error in handleStoreGPSData:", error);
      socket.emit("error", { message: "Failed to store GPS data" });
    }
  }

  async handleEndAdventure(socket: Socket): Promise<void> {
    const adventureLog = this.connectedUsers.get(socket.id);
    if (!adventureLog) {
      socket.emit("error", { message: "Failed to end adventure" });
      return;
    }
    try {
      await this.adventureService.endAdventure(adventureLog);

      socket.emit("adventure_result", { "data": adventureLog });
      this.connectedUsers.delete(socket.id);
    } catch (error) {
      console.error("Error in handleEndAdventure:", error);
      socket.emit("error", { message: "Failed to end adventure" });
    }
  }
}
