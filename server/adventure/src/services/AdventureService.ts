import AdventureRedisRepository from '../repositories/AdventureRedisRepository';
import AdventureMongoRepository from '../repositories/AdventureMongoRepository';
import AdventureMysqlRepository from '../repositories/AdventureMysqlRepository';
import AdventureLogModel from '../models/AdventureLogModel';
import CalcAdventureStats from '../utils/calcAdventureStats';

class AdventureService {
  private adventureRedisRepository: AdventureRedisRepository;
  private adventureMongoRepository: AdventureMongoRepository;
  private adventureMysqlRepository: AdventureMysqlRepository;

  constructor() {
    this.adventureRedisRepository = new AdventureRedisRepository();
    this.adventureMongoRepository = new AdventureMongoRepository();
    this.adventureMysqlRepository = new AdventureMysqlRepository();
  }

  async initAdventure(adventureLog: AdventureLogModel): Promise<void> {
    let adventureLogId = await this.adventureMysqlRepository.initAdventureLog(adventureLog);
    adventureLog.adventureLogId = adventureLogId;
  }

  // 위치 정보와 걸음 수를 저장, 근처 사용자 목록 반환
  async storeGPSData(userId: number, lat: number, lng: number, steps: number): Promise<{ userId: number; distance: number }[]> {
    await this.adventureRedisRepository.storeGPSData(userId, lat, lng, steps);

    let nearbyUsers = await this.adventureRedisRepository.findNearbyUsers(lat, lng, 300);
    nearbyUsers = nearbyUsers.filter(user => user.userId !== userId);
    return nearbyUsers;
  }

  async endAdventure(adventureLog: AdventureLogModel): Promise<void> {
    let locationData = await this.adventureRedisRepository.findUserLocationData(adventureLog.userId);
    let mongoId = await this.adventureMongoRepository.insertUserLocationData(adventureLog.userId, locationData);

    adventureLog.gpsLogKey = mongoId;
    adventureLog.gpsLog = locationData;
    adventureLog.endAt = new Date();
    adventureLog.adventureDistance = CalcAdventureStats.getDistanceFromGPSData(locationData);
    adventureLog.adventureCalorie = CalcAdventureStats.getCalorieBurned(locationData.reduce((acc, data) => acc + data.steps, 0));

    await this.adventureMysqlRepository.updateAdventureLog(adventureLog);

    await this.adventureRedisRepository.flushUserLocationData(adventureLog.userId);
  }
}

export default AdventureService;