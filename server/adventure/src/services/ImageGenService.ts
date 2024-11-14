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
  private defaultImageUrl: string; // 기본 이미지 URL

  constructor() {
    this.roadViewService = new RoadViewService();
    this.aiService = new AIService();
    this.imageMysqlRepository = new ImageMysqlRepository();
    this.cdnUrl = process.env.CDN_URL || "";
    this.defaultImageUrl = process.env.DEFAULT_IMAGE_URL || ""; // 기본 이미지 URL 설정
  }

  public async generateImage(
    adventureLog: AdventureLogModel
  ): Promise<boolean> {
    // console.log(
    //   "GenerateImage Log:",
    //   JSON.stringify(adventureLog.gpsLog, null, 2)
    // );

    const gpsLog = adventureLog.gpsLog;
    let selectedPoint = gpsLog[0];

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

    console.log("Selected RoadView Point: ", selectedPoint);

    // 이미지 URL 생성
    const imageUrl = this.roadViewService.getStreetViewLink(
      selectedPoint.lat,
      selectedPoint.lng
    );
    console.log("ImageUrl: ", imageUrl);

    const { date, time } = adventureLog.calculateMiddleAt();

    // AI 서비스로 이미지 생성
    const generatedImageUrl = await this.aiService.generateImageBasedOnPrompt(
      imageUrl,
      1,
      selectedPoint.lat,
      selectedPoint.lng,
      date,
      time
    );
    console.log("GeneratedImageUrl: ", generatedImageUrl);

    // FTP에 업로드 및 데이터베이스에 링크 저장
    const res = await this.uploadAndSaveImage(
      generatedImageUrl,
      adventureLog.adventureLogId
    );

    if (!res) {
      return false;
    }

    return true;
  }

  // FTP 업로드 및 이미지 URL 저장 함수로 분리
  private async uploadAndSaveImage(
    imageUrl: string,
    adventureLogId: number
  ): Promise<boolean> {
    console.log("uploadAndSaveImage: 시작", { imageUrl, adventureLogId });

    try {
      // 이미지 데이터 가져오기
      const response = await fetch(imageUrl);
      if (!response.ok) {
        console.error("uploadAndSaveImage: 이미지 fetch 오류", {
          status: response.status,
        });
        return false;
      }

      const imageBlob = await response.blob();
      const buffer = await imageBlob.arrayBuffer();
      const imageBuffer = Buffer.from(buffer);

      // FTP 업로드
      const ftpInstance = FTPUpload.getInstance();
      const filename = await ftpInstance.uploadImage(imageBuffer);
      console.log("uploadAndSaveImage: FTP 업로드 성공", { filename });

      // URL 생성 및 DB 저장
      const fileLink = this.cdnUrl + filename;
      await this.imageMysqlRepository.saveImageUrls(adventureLogId, [fileLink]);
      console.log("uploadAndSaveImage: DB 저장 성공", { fileLink });
      return true;
    } catch (error) {
      console.error("uploadAndSaveImage: 오류 발생", error);
      return false;
    } finally {
      console.log("uploadAndSaveImage: 종료", { adventureLogId });
    }
  }
}

export default ImageGenService;
