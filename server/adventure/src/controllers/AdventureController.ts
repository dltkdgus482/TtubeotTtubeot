import { Socket } from "socket.io";
import AdventureService from "../services/AdventureService";
import ImageGenService from "../services/ImageGenService";
import UserService from "../services/UserService";
import MQService from "../services/MQService";
import JWTParser from '../utils/JWTParser';

export class AdventureController {
  private adventureService: AdventureService;
  private imageGenService: ImageGenService;
  private userService: UserService;
  private mqService: MQService;
  private userMap: Map<number, Socket>;

  constructor(userMap: Map<number, Socket>) {
    this.adventureService = new AdventureService();
    this.imageGenService = new ImageGenService();
    this.userService = new UserService();
    this.mqService = new MQService('adventure');
    this.userMap = userMap;
  }

  async handleInitAdventure(socket: Socket, data: { token: string }): Promise<void> {
    let { token } = data;
    try {
      token = token.split(' ')[1];
      let userId = JWTParser.parseUserIdFromJWT(token);
      if (userId === -1) {
        throw new Error('Invalid JWT token');
      }

      console.log("사용자가 모험을 시작합니다.");

      this.userMap.set(userId, socket);

      let userTtubeotOwnershipId = await this.userService.getUserTtubeot(userId);
      console.log("사용자의 튜브옷 소유권 ID : ", userTtubeotOwnershipId);
      let { username, ttubeot_id } = await this.userService.getUserInfo(userId);
      console.log("사용자의 이름 : ", username, "사용자의 튜브옷 ID : ", ttubeot_id);

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

      if (isFriend) {
        let reward = await this.userService.tagFriend(userId, oppositeUserId);

        socket.emit("adventure_reward", { "type": 1, "reward": reward });

        await this.mqService.publish({
          type: "adventure_reward",
          data: {
            user_id: oppositeUserId,
            data: {
              "type": 1,
              "reward": reward
            }
          }
        });
      } else {
        let userInfo = await this.userService.getUserInfo(userId);
        await this.mqService.publish({
          type: "adventure_request",
          data: {
            user_id: oppositeUserId,
            data: {
              user_id: userId,
              username: userInfo.username,
              ttubeot_id: userInfo.ttubeot_id
            }
          }
        });
      }
    } catch (error) {
      console.error("Error in handleGreetRequest:", error);
      socket.emit("error", { message: "Failed to greet request" });
    }
  }

  async handleConfirmRequest(socket: Socket, data: { user_id: number, answer: boolean }): Promise<void> {
    try {
      const oppositeUserId = data.user_id;
      const userId = await this.adventureService.getUserIdBySocket(socket.id);

      if (!userId || !oppositeUserId) {
        throw new Error("Invalid user id");
      }

      if (data.answer) {
        let reward = await this.userService.tagFriend(userId, oppositeUserId);

        socket.emit("adventure_reward", { "type": 1, "reward": reward });

        await this.mqService.publish({
          type: "adventure_reward",
          data: {
            user_id: oppositeUserId,
            data: {
              "type": 1,
              "reward": reward
            }
          }
        });
      }
    } catch (error) {
      console.error("Error in handleConfirmRequest:", error);
      socket.emit("error", { message: "Failed to confirm request" });
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
