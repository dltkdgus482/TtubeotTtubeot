import { Db } from "mongodb";

class ParkRepository {
    private db: Db;

    constructor(db: Db) {
        this.db = db;
    }

    async findNearestParks(lat: number, lng: number, limit: number = 5) {
        const userLocation = {
            type: "Point",
            coordinates: [lng, lat],
        };

        return await this.db.collection("parks").aggregate([
            {
                $geoNear: {
                    near: userLocation,
                    distanceField: "distance",
                    spherical: true,
                    key: "location",
                },
            },
            {
                $limit: limit
            }
        ]).toArray();
    }
}

export default ParkRepository;
