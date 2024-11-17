import { Request, Response } from "express";
import ReportService from "../services/ReportService";
import JWTParser from "../utils/JWTParser";

const reportService = new ReportService();

class ReportController {
  async getAdventureLogList(req: Request, res: Response) {
    let token = req.headers.authorization?.split(" ")[1];
    let userId = JWTParser.parseUserIdFromJWT(token ?? "");
    if (userId === -1) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    let page = parseInt(req.query.page as string);
    let size = parseInt(req.query.size as string);
    if (isNaN(page) || isNaN(size)) {
      res.status(400).json({ message: "Bad Request" });
      return;
    }

    let adventureLogList = await reportService.getAdventureLogList(
      userId,
      page,
      size
    );
    res.json({ data: adventureLogList });
  }

  async getAdventureLogSize(req: Request, res: Response) {
    let token = req.headers.authorization?.split(" ")[1];
    let userId = JWTParser.parseUserIdFromJWT(token ?? "");
    console.log(userId + " 의 모험 발자취 갯수 조회 시작");

    if (userId === -1) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    let adventureLogSize = await reportService.getAdventureLogSize(userId);
    res.json({ data: adventureLogSize });
  }

  async getAdventureLogDetail(req: Request, res: Response) {
    let token = req.headers.authorization?.split(" ")[1];
    let userId = JWTParser.parseUserIdFromJWT(token ?? "");
    if (userId === -1) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    let adventureLogId = parseInt(req.params.adventureLogId);
    if (isNaN(adventureLogId)) {
      res.status(400).json({ message: "Bad Request" });
      return;
    }

    let adventureLog = await reportService.getAdventureLogDetail(
      adventureLogId
    );
    if (adventureLog.user_id !== userId) {
      res.status(403).json({ message: "Forbidden" });
      return;
    }

    if (!adventureLog) {
      res.status(404).json({ message: "Not Found" });
      return;
    }

    res.json({ data: adventureLog });
  }
}

export default new ReportController();
