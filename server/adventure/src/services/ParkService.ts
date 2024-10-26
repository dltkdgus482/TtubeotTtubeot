import ParkRepository from "../repositories/ParkRepository";

class ParkService {
    private parkRepository: ParkRepository;

    constructor(parkRepository: ParkRepository) {
        this.parkRepository = parkRepository;
    }

    async getNearestParks(lat: number, lng: number, limit: number = 5) {
        return await this.parkRepository.findNearestParks(lat, lng, limit);
    }
}

export default ParkService;
