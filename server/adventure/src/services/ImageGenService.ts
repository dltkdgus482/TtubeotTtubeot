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

  public async generateImage(adventureLog: AdventureLogModel): Promise<void> {
    console.log(
      "GenerateImage Log:",
      JSON.stringify(adventureLog.gpsLog, null, 2)
    );

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

    // 유효한 좌표가 없는 경우 기본 이미지 사용
    if (!selectedPoint) {
      console.log("No valid RoadView point found. Using default image.");
      const generatedImageUrl = await this.aiService.generateImageBasedOnPrompt(
        this.defaultImageUrl,
        1
      );

      await this.uploadAndSaveImage(
        generatedImageUrl,
        adventureLog.adventureLogId
      );
      return;
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

    // FTP에 업로드 및 데이터베이스에 링크 저장
    await this.uploadAndSaveImage(
      generatedImageUrl,
      adventureLog.adventureLogId
    );
  }

  // FTP 업로드 및 이미지 URL 저장 함수로 분리
  private async uploadAndSaveImage(
    imageUrl: string,
    adventureLogId: number
  ): Promise<void> {
    console.log("uploadAndSaveImage: 시작", { imageUrl, adventureLogId });

    try {
      // 이미지 데이터 가져오기
      const response = await fetch(imageUrl);
      if (!response.ok) {
        console.error("uploadAndSaveImage: 이미지 fetch 오류", {
          status: response.status,
        });
        throw new Error("Failed to fetch image.");
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
    } catch (error) {
      console.error("uploadAndSaveImage: 오류 발생", error);
      throw new Error("Failed to upload and save image.");
    }

    console.log("uploadAndSaveImage: 종료", { adventureLogId });
  }
}

export default ImageGenService;
