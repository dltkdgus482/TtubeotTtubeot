import RoadViewService from "./RoadViewService";
import AIService from "./AIService";
import AdventureLogModel from "../models/AdventureLogModel";
import ImageMysqlRepository from "../repositories/AdventureImageMysqlRepository";
import FTPUpload from "../utils/FTPUpload";
import dotenv from "dotenv";
import axios from "axios";
import UserService from "./UserService";

dotenv.config();

class ImageGenService {
  private roadViewService: RoadViewService;
  private aiService: AIService;
  private userService: UserService;
  private imageMysqlRepository: ImageMysqlRepository;
  private cdnUrl: string;
  private defaultImageUrl: string;

  constructor() {
    this.roadViewService = new RoadViewService();
    this.aiService = new AIService();
    this.userService = new UserService();
    this.imageMysqlRepository = new ImageMysqlRepository();
    this.cdnUrl = process.env.CDN_URL || "";
    this.defaultImageUrl = process.env.DEFAULT_IMAGE_URL || "";
  }

  public async generateImage(
    adventureLog: AdventureLogModel
  ): Promise<boolean> {
    const gpsLog = adventureLog.gpsLog;
    let selectedPoint = null;

    for (let i = 0; i < gpsLog.length; i++) {
      if (
        await this.roadViewService.checkStreetViewAvailability(
          gpsLog[i].lat,
          gpsLog[i].lng
        )
      ) {
        selectedPoint = gpsLog[i];
        break;
      }
    }

    // 새로운 메서드를 통해 ttubeot 데이터를 가져옵니다.
    const userTtubeotOwnershipId = adventureLog.userTtubeotOwnershipId;
    const ttubeotId = await this.userService.getTtubeotIdByOwnershipId(
      userTtubeotOwnershipId
    );

    const { date, time } = adventureLog.calculateMiddleAt();

    // 유효한 좌표가 없는 경우 기본 이미지 사용
    if (!selectedPoint) {
      console.log("No valid RoadView point found. Using default image.");
      const generatedImageUrl = await this.aiService.generateImageBasedOnPrompt(
        this.defaultImageUrl,
        1,
        gpsLog[0].lat,
        gpsLog[0].lng,
        date,
        time
      );
      // 기본 이미지 기반으로 생성된 사진이 제대로 업로드, 저장되었는지 여부 반환
      const res = await this.uploadAndSaveImage(
        generatedImageUrl,
        adventureLog.adventureLogId
      );

      if (!res) {
        return false;
      }
      return true;
    }

    console.log("Selected RoadView Point: ", selectedPoint);

    const imageUrl = this.roadViewService.getStreetViewLink(
      selectedPoint.lat,
      selectedPoint.lng
    );
    console.log("ImageUrl: ", imageUrl);

    const generatedImageUrl = await this.aiService.generateImageBasedOnPrompt(
      imageUrl,
      ttubeotId,
      selectedPoint.lat,
      selectedPoint.lng,
      date,
      time
    );
    console.log("GeneratedImageUrl: ", generatedImageUrl);

    const res = await this.uploadAndSaveImage(
      generatedImageUrl,
      adventureLog.adventureLogId
    );

    return res;
  }

  private async uploadAndSaveImage(
    imageUrl: string,
    adventureLogId: number
  ): Promise<boolean> {
    console.log("uploadAndSaveImage: 시작", { imageUrl, adventureLogId });

    try {
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

      const ftpInstance = FTPUpload.getInstance();
      const filename = await ftpInstance.uploadImage(imageBuffer);
      console.log("uploadAndSaveImage: FTP 업로드 성공", { filename });

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
