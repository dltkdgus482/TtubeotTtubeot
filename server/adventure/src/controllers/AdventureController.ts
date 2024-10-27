import { Socket } from "socket.io";
import AdventureService from "../services/AdventureService";

export class AdventureController {
  private adventureService: AdventureService;

  constructor() {
    this.adventureService = new AdventureService();
  }

  // 위치 및 걸음 수 저장 이벤트 처리
  async handleStoreGPSData(socket: Socket, data: { userId: number, lat: number, lng: number, steps: number }): Promise<void> {
    const { userId, lat, lng, steps } = data;
    try {
      let nearbyUsers = await this.adventureService.storeGPSData(userId, lat, lng, steps);

      socket.emit("adventure_user", { "users": nearbyUsers });
    } catch (error) {
      console.error("Error in handleStoreGPSData:", error);
      socket.emit("error", { message: "Failed to store GPS data" });
    }
  }

  async handleEndAdventure(socket: Socket, data: { userId: number }): Promise<void> {
    const { userId } = data;
    try {
      await this.adventureService.endAdventure(userId);
    } catch (error) {
      console.error("Error in handleEndAdventure:", error);
      socket.emit("error", { message: "Failed to end adventure" });
    }
  }
}
