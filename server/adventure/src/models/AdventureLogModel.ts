class AdventureLogModel {
  adventureLogId: number;
  userTtubeotOwnershipId: number;
  userId: number;
  adventureDistance: number;
  adventureCalorie: number;
  adventureCoin: number;
  adventureSteps: number;
  startAt: Date;
  endAt: Date;
  gpsLogKey: string;
  ttubeot_id: number;
  ttubeot_name: string;
  gpsLog: { lat: number; lng: number; steps: number; timestamp: number }[];
  imgUrls: string[];

  constructor(data: Partial<AdventureLogModel>) {
    this.adventureLogId = data.adventureLogId ?? 0;
    this.userTtubeotOwnershipId = data.userTtubeotOwnershipId ?? 0;
    this.userId = data.userId ?? 0;
    this.adventureDistance = data.adventureDistance ?? 0;
    this.adventureCalorie = data.adventureCalorie ?? 0;
    this.adventureCoin = data.adventureCoin ?? 0;
    this.adventureSteps = data.adventureSteps ?? 0;
    this.startAt =
      data.startAt instanceof Date
        ? data.startAt
        : new Date(data.startAt ?? Date.now());
    this.endAt =
      data.endAt instanceof Date
        ? data.endAt
        : new Date(data.endAt ?? Date.now());
    this.gpsLogKey = data.gpsLogKey ?? "";
    this.ttubeot_id = data.ttubeot_id ?? 0;
    this.ttubeot_name = data.ttubeot_name ?? "";
    this.gpsLog = data.gpsLog ?? [];
    this.imgUrls = data.imgUrls ?? [];
  }

  static create(data: Partial<AdventureLogModel>): AdventureLogModel {
    return new AdventureLogModel(data);
  }

  calculateMiddleAt(): { date: string; time: string } {
    // 날짜 유효성 확인
    if (isNaN(this.startAt.getTime()) || isNaN(this.endAt.getTime())) {
      throw new Error("Invalid startAt or endAt date format");
    }

    // 중간 타임스탬프 계산
    const middleTimestamp = (this.startAt.getTime() + this.endAt.getTime()) / 2;
    const middleDate = new Date(middleTimestamp);

    // YYYYMMDD 및 HHMM 형식 변환
    const date = middleDate.toISOString().split("T")[0].replace(/-/g, "");
    const [hours, minutes] = middleDate.toTimeString().split(":");
    const time = `${hours}${minutes}`;

    return { date, time };
  }

  toJsonObject(): any {
    return {
      adventure_log_id: this.adventureLogId,
      user_ttubeot_ownership_id: this.userTtubeotOwnershipId,
      user_id: this.userId,
      adventure_distance: this.adventureDistance,
      adventure_calorie: this.adventureCalorie,
      adventure_coin: this.adventureCoin,
      adventure_steps: this.adventureSteps,
      start_at: this.startAt,
      end_at: this.endAt,
      gps_log_key: this.gpsLogKey,
      ttubeot_id: this.ttubeot_id,
      ttubeot_name: this.ttubeot_name,
      gps_log: this.gpsLog,
      img_urls: this.imgUrls,
    };
  }
}

export default AdventureLogModel;
