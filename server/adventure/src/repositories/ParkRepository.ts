import client from '../config/database/mongo';
import { Collection } from 'mongodb';

class ParkRepository {
    private collection: Collection;

    constructor() {
        const db = client.db('park_database');
        this.collection = db.collection('parks');
    }

    async findNearestParks(lat: number, lng: number, limit: number = 5) {
        const userLocation = {
            type: "Point",
            coordinates: [lng, lat],
        };

        return await this.collection.aggregate([
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

    async findNearestParksWithDistance(lat: number, lng: number, distance: number) {
        const userLocation = {
            type: "Point",
            coordinates: [lng, lat],
        };

        return await this.collection.aggregate([
            {
                $geoNear: {
                    near: userLocation,
                    distanceField: "distance",
                    spherical: true,
                    key: "location",
                    maxDistance: distance,
                },
            },
        ]).toArray();
    }
}

export default ParkRepository;
