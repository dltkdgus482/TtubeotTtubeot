import AdventureRedisRepository from '../repositories/AdventureRedisRepository';

class AdventureService {
  private adventureRedisRepository: AdventureRedisRepository;

  // TODO: 현재 연결중인 사용자들 목록을 관리하는 HashMap 자료형 생성
  // TODO: socket_id를 key로, userId를 value로 하는 HashMap 자료형 생성, 이는 adventure_init 이벤트에서 JWT 토큰으로 등록되어야 함.
  // TODO: 아래에서 userId를 사용하는 부분을 HashMap을 사용하여 socket_id => userId로 치환, 이를 각 메서드에 적용해야 함.

  constructor() {
    this.adventureRedisRepository = new AdventureRedisRepository();
  }

  // 위치 정보와 걸음 수를 저장, 근처 사용자 목록 반환
  async storeGPSData(userId: number, lat: number, lng: number, steps: number): Promise<{ userId: number; distance: number }[]> {
    await this.adventureRedisRepository.storeGPSData(userId, lat, lng, steps);

    let nearbyUsers = await this.adventureRedisRepository.findNearbyUsers(lat, lng, 300);
    nearbyUsers = nearbyUsers.filter(user => user.userId !== userId);
    return nearbyUsers;
  }

  async endAdventure(userId: number): Promise<void> {
    let locationData = await this.adventureRedisRepository.findUserLocationData(userId);
    console.log(`Location data for user ${userId}:`, locationData);
  }
}

export default AdventureService;