import { GeoReplyWith } from "redis";
import redisClient from "../config/database/redis";

class AdventureRedisRepository {
    private readonly locationKey: string = "user_locations";

    async storeGPSData(userId: number, lat: number, lng: number, steps: number): Promise<void> {
        await redisClient.geoAdd(this.locationKey, {
            member: userId.toString(),
            longitude: lng,
            latitude: lat,
        });

        const userLocationKey = `user:${userId}:location_data`;
        const timestamp = Date.now();

        await redisClient.zAdd(userLocationKey, {
            score: timestamp,
            value: JSON.stringify({
                lat,
                lng,
                steps,
                timestamp,
            }),
        });
    }

    async findNearbyUsers(lat: number, lng: number, radius: number): Promise<{ userId: number; distance: number }[]> {
        const nearbyUsers = await redisClient.geoSearchWith(
            this.locationKey,
            { longitude: lng, latitude: lat },
            { radius, unit: "m" },
            [GeoReplyWith.DISTANCE]
        );

        return nearbyUsers.map((user) => ({
            userId: parseInt(user.member),
            distance: user.distance ?? 0,
        }));
    }

    async findUserLocationData(userId: number): Promise<{ lat: number; lng: number; steps: number; timestamp: number }[]> {
        const userLocationKey = `user:${userId}:location_data`;
        const locationData = await redisClient.zRange(userLocationKey, 0, -1);

        return locationData.map((data) => JSON.parse(data));
    }
}

export default AdventureRedisRepository;
