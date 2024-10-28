import AdventureRedisRepository from '../repositories/AdventureRedisRepository';
import AdventureMongoRepository from '../repositories/AdventureMongoRepository';
import AdventureMysqlRepository from '../repositories/AdventureMysqlRepository';
import AdventureLogModel from '../models/AdventureLogModel';
import CalcAdventureStats from '../utils/CalcAdventureStats';

class AdventureService {
  private adventureRedisRepository: AdventureRedisRepository;
  private adventureMongoRepository: AdventureMongoRepository;
  private adventureMysqlRepository: AdventureMysqlRepository;

  constructor() {
    this.adventureRedisRepository = new AdventureRedisRepository();
    this.adventureMongoRepository = new AdventureMongoRepository();
    this.adventureMysqlRepository = new AdventureMysqlRepository();
  }

  async initAdventure(userId: number, socket: string): Promise<void> {
    let adventureLog = AdventureLogModel.create({ userId, userTtubeotOwnershipId: 0 }); // TODO: 현재는 userTtubeotOwnershipId를 0으로 설정, 추후 user 서비스와 연동하여 수정해야 함.

    let adventureLogId = await this.adventureMysqlRepository.initAdventureLog(adventureLog);
    adventureLog.adventureLogId = adventureLogId;

    await this.adventureRedisRepository.setOnline(adventureLog, socket);
  }

  // 위치 정보와 걸음 수를 저장, 근처 사용자 목록 반환
  async storeGPSData(socket: string, lat: number, lng: number, steps: number): Promise<{ userId: number; distance: number }[]> {
    let adventureLog = await this.adventureRedisRepository.getAdventureLog(socket);
    let userId = adventureLog.userId;

    await this.adventureRedisRepository.storeGPSData(userId, lat, lng, steps);

    let nearbyUsers = await this.adventureRedisRepository.findNearbyUsers(lat, lng, 300);
    nearbyUsers = nearbyUsers.filter(user => user.userId !== userId);
    return nearbyUsers;
  }

  async endAdventure(socket: string): Promise<AdventureLogModel> {
    let adventureLog = await this.adventureRedisRepository.getAdventureLog(socket);
    let userId = adventureLog.userId;

    let locationData = await this.adventureRedisRepository.findUserLocationData(userId);
    let mongoId = await this.adventureMongoRepository.insertUserLocationData(userId, locationData);

    adventureLog.gpsLogKey = mongoId;
    adventureLog.gpsLog = locationData;
    adventureLog.endAt = new Date();
    adventureLog.adventureDistance = CalcAdventureStats.getDistanceFromGPSData(locationData);
    adventureLog.adventureCalorie = CalcAdventureStats.getCalorieBurned(CalcAdventureStats.getCalorieBurned(CalcAdventureStats.getStepsFromGPSData(locationData)));

    await this.adventureMysqlRepository.updateAdventureLog(adventureLog);

    await this.adventureRedisRepository.flushUserLocationData(adventureLog.userId);
    await this.adventureRedisRepository.setOffline(socket);

    return adventureLog;
  }
}

export default AdventureService;