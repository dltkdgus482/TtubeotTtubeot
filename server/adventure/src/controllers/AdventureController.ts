import { Socket } from "socket.io";
import AdventureService from "../services/AdventureService";
import ImageGenService from "../services/ImageGenService";
import UserService from "../services/UserService";
import JWTParser from '../utils/JWTParser';

export class AdventureController {
  private adventureService: AdventureService;
  private imageGenService: ImageGenService;
  private userService: UserService;

  constructor() {
    this.adventureService = new AdventureService();
    this.imageGenService = new ImageGenService();
    this.userService = new UserService();
  }

  async handleInitAdventure(socket: Socket, data: { token: string }): Promise<void> {
    let { token } = data;
    try {
      token = token.split(' ')[1];
      let userId = JWTParser.parseUserIdFromJWT(token);
      if (userId === -1) {
        throw new Error('Invalid JWT token');
      }

      let userTtubeotOwnershipId = await this.userService.getUserTtubeot(userId);
      let { username, ttubeot_id } = await this.userService.getUserInfo(userId);

      console.log(userId, "사용자가 모험을 시작합니다.");

      await this.adventureService.initAdventure(userId, userTtubeotOwnershipId, username, ttubeot_id, socket.id);
    } catch (error) {
      console.error("Error in handleInitAdventure:", error);
      socket.emit("error", { message: "Failed to initialize adventure" });
    }
  }

  // 위치 및 걸음 수 저장 이벤트 처리
  async handleStoreGPSData(socket: Socket, data: { lat: number, lng: number, steps: number }): Promise<void> {
    const { lat, lng, steps } = data;
    try {
      console.log("사용자의 위치 : ", lat, lng, "사용자의 걸음 수 : ", steps);
      let storedData = await this.adventureService.storeGPSData(socket.id, lat, lng, steps);
      let nearbyUsers = await this.adventureService.getNearbyUsers(socket.id, lat, lng, 300);
      let reward = await this.adventureService.getReward(socket.id, lat, lng, storedData.steps);
      let parkList = await this.adventureService.getParkInfos(socket.id, lat, lng);

      if (reward.reward > 0) {
        socket.emit("adventure_reward", { "type": 0, "reward": reward.reward, "remain_count": reward.remain_count });
      }

      socket.emit("adventure_park", { "parks": parkList });
      socket.emit("adventure_user", { "users": nearbyUsers });
    } catch (error) {
      console.error("Error in handleStoreGPSData:", error);
      socket.emit("error", { message: "Failed to store GPS data" });
    }
  }

  async handleGreetRequest(socket: Socket, data: { user_id: number }): Promise<void> {
    try {
      const oppositeUserId = data.user_id;
      const userId = await this.adventureService.getUserIdBySocket(socket.id);

      if (!userId || !oppositeUserId) {
        throw new Error("Invalid user id");
      }

      let isFriend = await this.userService.checkFriendship(userId, oppositeUserId);
    } catch (error) {
      console.error("Error in handleGreetRequest:", error);
      socket.emit("error", { message: "Failed to greet request" });
    }
  }

  async handleEndAdventure(socket: Socket): Promise<void> {
    try {
      console.log("사용자가 모험을 종료합니다.");
      let adventureLog = await this.adventureService.endAdventure(socket.id);

      socket.emit("adventure_result", { "data": adventureLog });

      socket.disconnect();

      this.imageGenService.generateImage(adventureLog);
    } catch (error) {
      console.error("Error in handleEndAdventure:", error);
      socket.emit("error", { message: "Failed to end adventure" });
    }
  }

  async handleDisconnect(socket: Socket): Promise<void> {
    try {
      console.log("사용자가 접속을 종료합니다.");
      await this.adventureService.endAdventure(socket.id);
    } catch (error) {
      console.error("Error in handleDisconnect:", error);
    }
  }
}
