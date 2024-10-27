import { GeoReplyWith } from "redis";
import redisClient from "../config/database/redis";
import AdventureLogModel from "../models/AdventureLogModel";
import { Socket } from "socket.io";

class AdventureRedisRepository {
    private readonly locationKey: string = "user_locations";
    private readonly onlineUsersKey: string = "online_users";

    async setOnline(adventureLog: AdventureLogModel, socket: string): Promise<void> {
        await redisClient.hSet(this.onlineUsersKey, socket, JSON.stringify(adventureLog));
    }

    async setOffline(socket: string): Promise<void> {
        await redisClient.hDel(this.onlineUsersKey, socket);
    }

    async getAdventureLog(socket: string): Promise<AdventureLogModel> {
        const adventureLog = await redisClient.hGet(this.onlineUsersKey, socket) ?? "{}";
        return AdventureLogModel.create(JSON.parse(adventureLog))
    }

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

    async flushUserLocationData(userId: number): Promise<void> {
        const userLocationKey = `user:${userId}:location_data`;
        await redisClient.del(userLocationKey);

        await redisClient.zRem(this.locationKey, userId.toString());
    }
}

export default AdventureRedisRepository;
