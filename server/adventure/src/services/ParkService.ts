import ParkRepository from "../repositories/ParkRepository";

class ParkService {
    private parkRepository: ParkRepository;

    constructor() {
        this.parkRepository = new ParkRepository();
    }

    async getNearestParks(lat: number, lng: number, limit: number = 5) {
        return await this.parkRepository.findNearestParks(lat, lng, limit);
    }
}

export default ParkService;
