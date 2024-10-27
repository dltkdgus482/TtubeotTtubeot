import AdventureRepository from '../repositories/adventureRepository';

class AdventureService {
  private adventureRepository: AdventureRepository;

  constructor() {
    this.adventureRepository = new AdventureRepository();
  }

  // 위치 정보와 걸음 수를 저장, 근처 사용자 목록 반환
  async storeGPSData(userId: number, lat: number, lng: number, steps: number): Promise<{ userId: number; distance: number }[]> {
    await this.adventureRepository.storeGPSData(userId, lat, lng, steps);

    let nearbyUsers = await this.adventureRepository.findNearbyUsers(lat, lng, 300);
    nearbyUsers = nearbyUsers.filter(user => user.userId !== userId);
    return nearbyUsers;
  }
}

export default AdventureService;