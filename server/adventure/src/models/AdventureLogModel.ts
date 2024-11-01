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
  gpsLog: { lat: number, lng: number, steps: number, timestamp: number }[];
  imgUrls: string[];

  constructor(data: Partial<AdventureLogModel>) {
    this.adventureLogId = data.adventureLogId ?? 0;
    this.userTtubeotOwnershipId = data.userTtubeotOwnershipId ?? 0;
    this.userId = data.userId ?? 0;
    this.adventureDistance = data.adventureDistance ?? 0;
    this.adventureCalorie = data.adventureCalorie ?? 0;
    this.adventureCoin = data.adventureCoin ?? 0;
    this.adventureSteps = data.adventureSteps ?? 0;
    this.startAt = data.startAt ?? new Date();
    this.endAt = data.endAt ?? new Date();
    this.gpsLogKey = data.gpsLogKey ?? '';
    this.gpsLog = data.gpsLog ?? [];
    this.imgUrls = data.imgUrls ?? [];
  }

  static create(data: Partial<AdventureLogModel>): AdventureLogModel {
    return new AdventureLogModel(data);
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
      gps_log: this.gpsLog,
      img_urls: this.imgUrls
    };
  }
}

export default AdventureLogModel;