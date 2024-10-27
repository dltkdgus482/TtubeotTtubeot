class AdventureLogModel {
  adventureLogId: number;
  userTtubeotOwnershipId: number;
  userId: number;
  adventureDistance: number;
  adventureCalorie: number;
  adventureCoin: number;
  startAt: Date;
  endAt: Date;
  gpsLogKey: string;
  gpsLog: { lat: number, lng: number, steps: number, timestamp: number }[];

  constructor(data: Partial<AdventureLogModel>) {
    this.adventureLogId = data.adventureLogId ?? 0;
    this.userTtubeotOwnershipId = data.userTtubeotOwnershipId ?? 0;
    this.userId = data.userId ?? 0;
    this.adventureDistance = data.adventureDistance ?? 0;
    this.adventureCalorie = data.adventureCalorie ?? 0;
    this.adventureCoin = data.adventureCoin ?? 0;
    this.startAt = data.startAt ?? new Date();
    this.endAt = data.endAt ?? new Date();
    this.gpsLogKey = data.gpsLogKey ?? '';
    this.gpsLog = data.gpsLog ?? [];
  }

  static create(data: Partial<AdventureLogModel>): AdventureLogModel {
    return new AdventureLogModel(data);
  }
}

export default AdventureLogModel;