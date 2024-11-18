import { Router } from "express";
import ReportController from "../controllers/ReportController";

const router = Router();

router.get("/:adventureLogId", ReportController.getAdventureLogDetail);
router.get("/", ReportController.getAdventureLogList);
router.get("/log-count", ReportController.getAdventureLogSize);

export default router;
