import RoadViewService from "./RoadViewService";
import AIService from "./AIService";
import AdventureLogModel from "../models/AdventureLogModel";
import ImageMysqlRepository from "../repositories/AdventureImageMysqlRepository";

class ImageGenService {
  private roadViewService: RoadViewService;
  private aiService: AIService;
  private imageMysqlRepository: ImageMysqlRepository;

  constructor() {
    this.roadViewService = new RoadViewService();
    this.aiService = new AIService();
    this.imageMysqlRepository = new ImageMysqlRepository();
  }

  public async generateImage(adventureLog: AdventureLogModel): Promise<void> {
    const gpsLog = adventureLog.gpsLog;
    let roadViewPoints = [];

    for (let i = 0; i < 4; i++) {
      let start = i * gpsLog.length / 4;
      let end = (i + 1) * gpsLog.length / 4;

      while (start < end) {
        if (await this.roadViewService.checkStreetViewAvailability(gpsLog[start].lat, gpsLog[start].lng)) {
          roadViewPoints.push(gpsLog[start]);
          break;
        }
        start++;
      }
    }

    let imageUrls = [];
    for (let point of roadViewPoints) {
      let imageUrl = this.roadViewService.getStreetViewLink(point.lat, point.lng);
      let generatedImageUrl = await this.aiService.image2image(imageUrl);
      imageUrls.push(generatedImageUrl);
    }

    await this.imageMysqlRepository.saveImageUrls(adventureLog.adventureLogId, imageUrls);
  }
}

export default ImageGenService;