import AdventureRedisRepository from '../repositories/AdventureRedisRepository';
import AdventureMongoRepository from '../repositories/AdventureMongoRepository';
import AdventureMysqlRepository from '../repositories/AdventureMysqlRepository';

import UserService from './UserService';

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

  async initAdventure(userId: number, userTtubeotOwnershipId: number, socket: string): Promise<void> {
    let adventureLog = AdventureLogModel.create({ userId, userTtubeotOwnershipId });

    let adventureLogId = await this.adventureMysqlRepository.initAdventureLog(adventureLog);
    adventureLog.adventureLogId = adventureLogId;

    await this.adventureRedisRepository.setOnline(adventureLog, socket);
  }

  async storeGPSData(socket: string, lat: number, lng: number, steps: number): Promise<{ lat: number, lng: number, steps: number, timestamp: string, }> {
    let adventureLog = await this.adventureRedisRepository.getAdventureLog(socket);
    let userId = adventureLog.userId;

    return await this.adventureRedisRepository.storeGPSData(userId, lat, lng, steps);
  }

  async getNearbyUsers(socket: string, lat: number, lng: number, radius: number): Promise<{ userId: number; distance: number }[]> {
    let adventureLog = await this.adventureRedisRepository.getAdventureLog(socket);
    let userId = adventureLog.userId;

    let nearbyUsers = await this.adventureRedisRepository.findNearbyUsers(lat, lng, radius);
    nearbyUsers = nearbyUsers.filter(user => user.userId !== userId);
    return nearbyUsers;
  }

  async endAdventure(socket: string): Promise<AdventureLogModel> {
    let adventureLog = await this.adventureRedisRepository.getAdventureLog(socket);
    let userId = adventureLog.userId;
    console.log(adventureLog);

    let locationData = await this.adventureRedisRepository.findUserLocationData(userId);
    console.log(locationData);
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

  async getReward(socket: string, lat: number, lng: number, steps: number): Promise<{ reward: number, remain_count: number }> {
    let adventureLog = await this.adventureRedisRepository.getAdventureLog(socket);
    let userId = adventureLog.userId;

    let parkList = await this.parkRepository.findNearestParksWithDistance(lat, lng, 1500);

    let park = parkList[0];

    if (park.distance > 100) {
      return { reward: 0, remain_count: 0 };
    }

    let remainCounts = await this.adventureRedisRepository.getRemainCounts(userId, park._id);
    let remainCount = remainCounts[0] - steps;

    if (remainCount <= 0) {
      remainCounts.shift();
      await this.adventureRedisRepository.setRemainCounts(userId, park._id, remainCounts);

      let reward = Math.floor(Math.random() * 100) + 100;

      adventureLog.adventureCoin += reward;
      await this.adventureRedisRepository.setOnline(adventureLog, socket);

      return { reward, remain_count: remainCounts.length };
    }

    remainCounts[0] = remainCount;
    await this.adventureRedisRepository.setRemainCounts(userId, park._id, remainCounts);

    return { reward: 0, remain_count: 0 };
  }
}

export default AdventureService;