import axios from "axios";
import dotenv from "dotenv";

dotenv.config();
class UserService {
  private readonly baseUrl = "user.ttubeot-user.svc.cluster.local:8080";
  private secretKey: string = process.env.DEV_SECRET_KEY || "";

  async getUserTtubeot(userId: number): Promise<number> {
    let response = await fetch(
      `http://${this.baseUrl}/user/ttubeot/adventure/${userId}/id`
    );
    console.log(response);
    let result = await response.json();
    console.log(result);

    return result.userTtubeotOwnershipId;
  }

  async getUserInfo(
    userId: number
  ): Promise<{ username: string; ttubeotId: number }> {
    let response = await fetch(
      `http://${this.baseUrl}/user/other-profile/${userId}`
    );
    console.log(response);
    let result = await response.json();
    console.log(result);

    return { username: result.username, ttubeotId: result.ttubeotId };
  }

  async checkFriendship(userId: number, friendId: number): Promise<boolean> {
    let response = await fetch(
      `http://${this.baseUrl}/user/friend/check-friend/${userId}/${friendId}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    );
    console.log("checkFriendship response: ", response);

    return response.status === 200;
  }

  async tagFriend(userId: number, friendId: number): Promise<number> {
    let reqeust = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, friendId }),
    };
    console.log(reqeust);
    let response = await fetch(
      `http://${this.baseUrl}/user/friend/tag`,
      reqeust
    );
    console.log(response);

    let result = await response.json();
    console.log(result);

    return result.coin || 0;
  }

  async postAdventureCoin(userId: number, coin: number): Promise<void> {
    let requestBody = { userId, coin };
    await fetch(`http://${this.baseUrl}/user/adventure-coin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Secret-Key": this.secretKey,
      },
      body: JSON.stringify(requestBody),
    });
  }

  async getTtubeotIdByOwnershipId(
    userTtubeotOwnershipId: number
  ): Promise<number> {
    try {
      const response = await axios.get(
        `http://${this.baseUrl}/user/ttubeot/find-ttubeot/${userTtubeotOwnershipId}`
      );
      console.log("Fetched Ttubeot Data:", response.data);

      // 응답 본문에서 ttubeotId만 추출하여 반환
      const ttubeotId = response.data.ttubeotId;
      return ttubeotId;
    } catch (error) {
      console.error("Error fetching Ttubeot data:", error);
      return 1;
    }
  }
}

export default UserService;
