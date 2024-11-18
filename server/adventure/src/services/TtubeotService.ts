import axios from "axios";
import dotenv from "dotenv";

dotenv.config();
class TtubeotService {
  private readonly baseUrl = "user.ttubeot-user.svc.cluster.local:8080";
  private secretKey: string = process.env.DEV_SECRET_KEY || "";

  async getTtubeotIdByOwnershipId(
    userTtubeotOwnershipId: number
  ): Promise<any> {
    try {
      console.log("userTtubeotOwnershipId: ", userTtubeotOwnershipId);

      const response = await axios.get(
        `http://${this.baseUrl}/user/ttubeot/find-ttubeot/${userTtubeotOwnershipId}`
      );
      console.log("Fetched Ttubeot Data:", response.data);

      return response.data;
    } catch (error) {
      console.error("Error fetching Ttubeot data:", error);
      return null;
    }
  }
}

export default TtubeotService;
