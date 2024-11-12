import RoadViewService from "./RoadViewService";
import AIService from "./AIService";
import AdventureLogModel from "../models/AdventureLogModel";
import ImageMysqlRepository from "../repositories/AdventureImageMysqlRepository";
import FTPUpload from "../utils/FTPUpload";
import dotenv from "dotenv";

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
    this.cdnUrl = process.env.CDN_URL || "";
  }

  public async generateImage(adventureLog: AdventureLogModel): Promise<void> {
    const gpsLog = adventureLog.gpsLog;
    let selectedPoint = null;

    // 첫 번째 유효한 RoadView 좌표만 찾기
    for (let i = 0; i < gpsLog.length; i++) {
      if (
        await this.roadViewService.checkStreetViewAvailability(
          gpsLog[i].lat,
          gpsLog[i].lng
        )
      ) {
        selectedPoint = gpsLog[i];
        break; // 첫 번째 유효한 좌표를 찾았으므로 반복문 종료
      }
    }

    if (!selectedPoint) {
      console.log("No valid RoadView point found.");
      return; // 유효한 좌표가 없는 경우 함수 종료
    }

    console.log("Selected RoadView Point: ", selectedPoint);

    // 이미지 URL 생성
    const imageUrl = this.roadViewService.getStreetViewLink(
      selectedPoint.lat,
      selectedPoint.lng
    );
    console.log("ImageUrl: ", imageUrl);

    // AI 서비스로 이미지 생성
    const generatedImageUrl = await this.aiService.generateImageBasedOnPrompt(
      imageUrl,
      1
    );
    console.log("GeneratedImageUrl: ", generatedImageUrl);

    // FTP에 업로드 및 URL 저장
    const response = await fetch(generatedImageUrl);
    const imageBlob = await response.blob();
    const buffer = await imageBlob.arrayBuffer();
    const imageBuffer = Buffer.from(buffer);

    const ftpInstance = FTPUpload.getInstance();
    const filename = await ftpInstance.uploadImage(imageBuffer);

    const fileLink = this.cdnUrl + filename;

    // 데이터베이스에 파일 링크 저장
    await this.imageMysqlRepository.saveImageUrls(adventureLog.adventureLogId, [
      fileLink,
    ]);
  }
}

export default ImageGenService;
