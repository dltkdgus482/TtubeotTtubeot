import AdventureMongoRepository from "../repositories/AdventureMongoRepository";
import AdventureMysqlRepository from "../repositories/AdventureMysqlRepository";
import AdventureImageMysqlRepository from "../repositories/AdventureImageMysqlRepository";
import AdventureLogModel from "../models/AdventureLogModel";
import TtubeotService from "../services/TtubeotService";

class ReportService {
  private adventureMongoRepository: AdventureMongoRepository;
  private adventureMysqlRepository: AdventureMysqlRepository;
  private adventureImageMysqlRepository: AdventureImageMysqlRepository;
  private ttubeotService: TtubeotService;

  constructor() {
    this.adventureMongoRepository = new AdventureMongoRepository();
    this.adventureMysqlRepository = new AdventureMysqlRepository();
    this.adventureImageMysqlRepository = new AdventureImageMysqlRepository();
    this.ttubeotService = new TtubeotService();
  }

  async getAdventureLogList(
    userId: number,
    page: number,
    size: number
  ): Promise<AdventureLogModel[]> {
    let adventureLogList =
      await this.adventureMysqlRepository.getAdventureLogList(
        userId,
        page,
        size
      );

    for (let adventureLog of adventureLogList) {
      adventureLog.image_urls =
        await this.adventureImageMysqlRepository.findImageUrlsByAdventureLogId(
          adventureLog.adventure_log_id
        );
      let ttubeotInfo = await this.ttubeotService.getTtubeotIdByOwnershipId(
        adventureLog.user_ttubeot_ownership_id
      );

      adventureLog.ttubeot_id = ttubeotInfo.ttubeotId;
      adventureLog.ttubeot_name = ttubeotInfo.ttubeotName;
      console.log("뚜벗 정보: ", ttubeotInfo);
    }
    return adventureLogList;
  }

  async getAdventureLogDetail(adventureLogId: number): Promise<any> {
    let adventureLog =
      await this.adventureMysqlRepository.getAdventureLogDetail(adventureLogId);

    let response = await this.adventureMongoRepository.getUserLocationData(
      adventureLog.gps_log_key
    );

    // 각 항목의 lat, lng 필드를 latitude, longitude로 변환
    adventureLog.gps_log = response.map((item) => ({
      latitude: item.lat,
      longitude: item.lng,
      steps: item.steps,
      timestamp: item.timestamp,
    }));

    adventureLog.image_urls =
      await this.adventureImageMysqlRepository.findImageUrlsByAdventureLogId(
        adventureLog.adventure_log_id
      );
    return adventureLog;
  }
}

export default ReportService;
