import RoadViewService from "./RoadViewService";
import AIService from "./AIService";
import AdventureLogModel from "../models/AdventureLogModel";
import ImageMysqlRepository from "../repositories/AdventureImageMysqlRepository";
import FTPUpload from "../utils/FTPUpload";
import dotenv from 'dotenv';

dotenv.config();

class ImageGenService {
  private roadViewService: RoadViewService;
  private aiService: AIService;
  private imageMysqlRepository: ImageMysqlRepository;
  private cdnUrl: string;

  constructor() {
    this.roadViewService = new RoadViewService();
    this.aiService = new AIService();
    this.imageMysqlRepository = new ImageMysqlRepository();
    this.cdnUrl = process.env.CDN_URL || '';
  }

  public async generateImage(adventureLog: AdventureLogModel): Promise<void> {
    const gpsLog = adventureLog.gpsLog;
    let roadViewPoints = [];

    for (let i = 0; i < 4; i++) {
      let start = Math.floor(i * gpsLog.length / 4);
      let end = Math.floor((i + 1) * gpsLog.length / 4);

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

    let fileLinks = [];
    for (let imageUrl of imageUrls) {
      const response = await fetch(imageUrl);
      const imageBlob = await response.blob();
      const buffer = await imageBlob.arrayBuffer();
      const imageBuffer = Buffer.from(buffer);

      let filename = await FTPUpload.uploadImage(imageBuffer);
      fileLinks.push(this.cdnUrl + filename);
    }
    await this.imageMysqlRepository.saveImageUrls(adventureLog.adventureLogId, fileLinks);
  }
}

export default ImageGenService;