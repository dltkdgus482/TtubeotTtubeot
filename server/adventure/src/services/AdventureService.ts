import AdventureRedisRepository from '../repositories/AdventureRedisRepository';
import AdventureMongoRepository from '../repositories/AdventureMongoRepository';
import AdventureMysqlRepository from '../repositories/AdventureMysqlRepository';
import ParkRepository from '../repositories/ParkRepository';
import AdventureLogModel from '../models/AdventureLogModel';
import CalcAdventureStats from '../utils/CalcAdventureStats';

class AdventureService {
  private adventureRedisRepository: AdventureRedisRepository;
  private adventureMongoRepository: AdventureMongoRepository;
  private adventureMysqlRepository: AdventureMysqlRepository;
  private parkRepository: ParkRepository;

  constructor() {
    this.adventureRedisRepository = new AdventureRedisRepository();
    this.adventureMongoRepository = new AdventureMongoRepository();
    this.adventureMysqlRepository = new AdventureMysqlRepository();
    this.parkRepository = new ParkRepository();
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

    let userSteps = await this.adventureRedisRepository.getStepCount(userId);

    adventureLog.gpsLogKey = mongoId;
    adventureLog.gpsLog = locationData;
    adventureLog.endAt = new Date();
    adventureLog.adventureDistance = CalcAdventureStats.getDistanceFromGPSData(locationData);
    adventureLog.adventureCalorie = CalcAdventureStats.getCalorieBurned(userSteps);
    adventureLog.adventureSteps = userSteps;

    await this.adventureMysqlRepository.updateAdventureLog(adventureLog);

    await this.adventureRedisRepository.flushUserLocationData(adventureLog.userId);
    await this.adventureRedisRepository.setOffline(socket);

    return adventureLog;
  }

  async getParkInfos(socket: string, lat: number, lng: number): Promise<any[]> {
    let adventureLog = await this.adventureRedisRepository.getAdventureLog(socket);
    let userId = adventureLog.userId;

    let parkList = await this.parkRepository.findNearestParksWithDistance(lat, lng, 1500);
    let result = [];

    for (let park of parkList) {
      let remainCounts = await this.adventureRedisRepository.getRemainCounts(userId, park._id);

      if (!await this.adventureRedisRepository.isExistRemainCounts(userId, park._id)) {
        let repeat = Math.floor(Math.random() * 3) + 3;
        for (let i = 0; i < repeat; i++) {
          remainCounts.push(Math.floor(Math.random() * 200) + 300);
        }
        await this.adventureRedisRepository.setRemainCounts(userId, park._id, remainCounts);
      }

      result.push({
        name: park.name,
        lat: park.location.coordinates[1],
        lng: park.location.coordinates[0],
        distance: park.distance,
        remain_count: remainCounts.length,
      });
    }

    return result;
  }
}

export default AdventureService;