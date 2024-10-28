import { Socket } from "socket.io";
import AdventureService from "../services/AdventureService";
import AdventureLogModel from '../models/AdventureLogModel';
import JWTParser from '../utils/JWTParser';

export class AdventureController {
  private adventureService: AdventureService;

  constructor() {
    this.adventureService = new AdventureService();
  }

  async handleInitAdventure(socket: Socket, data: { token: string }): Promise<void> {
    let { token } = data;
    try {
      token = token.split(' ')[1];
      let userId = JWTParser.parseUserIdFromJWT(token);
      if (userId === -1) {
        throw new Error('Invalid JWT token');
      }

      await this.adventureService.initAdventure(userId, socket.id);
    } catch (error) {
      console.error("Error in handleInitAdventure:", error);
      socket.emit("error", { message: "Failed to initialize adventure" });
    }
  }

  // 위치 및 걸음 수 저장 이벤트 처리
  async handleStoreGPSData(socket: Socket, data: { lat: number, lng: number, steps: number }): Promise<void> {
    const { lat, lng, steps } = data;
    try {
      let nearbyUsers = await this.adventureService.storeGPSData(socket.id, lat, lng, steps);

      socket.emit("adventure_user", { "users": nearbyUsers });
    } catch (error) {
      console.error("Error in handleStoreGPSData:", error);
      socket.emit("error", { message: "Failed to store GPS data" });
    }
  }

  async handleEndAdventure(socket: Socket): Promise<void> {
    try {
      let adventureLog = await this.adventureService.endAdventure(socket.id);

      socket.emit("adventure_result", { "data": adventureLog });
    } catch (error) {
      console.error("Error in handleEndAdventure:", error);
      socket.emit("error", { message: "Failed to end adventure" });
    }
  }
}
