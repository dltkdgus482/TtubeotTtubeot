import ParkRepository from "../repositories/ParkRepository";

class ParkService {
    private parkRepository: ParkRepository;

    constructor() {
        this.parkRepository = new ParkRepository();
    }

    async getNearestParks(lat: number, lng: number, limit: number = 5) {
        return await this.parkRepository.findNearestParks(lat, lng, limit);
    }

    async getNearestParksWithDistance(lat: number, lng: number, distance: number) {
        return await this.parkRepository.findNearestParksWithDistance(lat, lng, distance);
    }
}

export default ParkService;
