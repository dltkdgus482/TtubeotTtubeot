import { Request, Response } from "express";
import client from "../config/database/mongo";
import ParkRepository from "../repositories/ParkRepository";
import ParkService from "../services/ParkService";

const parkRepository = new ParkRepository(client.db("park_database"));
const parkService = new ParkService(parkRepository);

class ParkController {
  async getNearestParks(req: Request, res: Response) {
    try {
      const { lat, lng } = req.query;

      if (!lat || !lng) {
        res.status(400).json({ message: "위도와 경도를 입력해주세요." });
        return;
      }
      
      const nearestParks = await parkService.getNearestParks(
        parseFloat(lat as string),
        parseFloat(lng as string)
      );

      const data = nearestParks.map(park => ({
        name: park.name,
        lat: park.latitude,
        lng: park.longitude,
        distance: park.distance,
      }));

      res.json({ data });
    } catch (error) {
      console.error("가까운 공원 정보를 가져오는 중 오류 발생:", error);
      res.status(500).json({ message: "서버 오류가 발생했습니다." });
    }
  }
}

export default new ParkController();