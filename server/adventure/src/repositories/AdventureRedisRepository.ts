import { GeoReplyWith } from "redis";
import redisClient from "../config/database/redis";
import AdventureLogModel from "../models/AdventureLogModel";

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

    async getStepCount(userId: number): Promise<number> {
        const userStepsKey = `user:${userId}:steps`;
        const stepCount = await redisClient.get(userStepsKey) ?? "0";

        return parseInt(stepCount);
    }

    async storeGPSData(userId: number, lat: number, lng: number, steps: number): Promise<{ lat: number, lng: number, steps: number, timestamp: string, }> {
        if (!userId || userId <= 0) {
            return {
                lat,
                lng,
                steps,
                timestamp: new Date().toISOString(),
            };
        }

        await redisClient.geoAdd(this.locationKey, {
            member: userId.toString(),
            longitude: lng,
            latitude: lat,
        });

        const userLastStepsKey = `user:${userId}:last_steps`;
        const lastStepCount = await redisClient.get(userLastStepsKey);
        const currentStepCount = steps - (lastStepCount ? parseInt(lastStepCount) : steps);

        await redisClient.set(userLastStepsKey, steps);

        const userStepsKey = `user:${userId}:steps`;
        await redisClient.incrBy(userStepsKey, currentStepCount);

        const userLocationKey = `user:${userId}:location_data`;
        const timestamp = new Date().toISOString();

        await redisClient.zAdd(userLocationKey, {
            score: Date.now(),
            value: JSON.stringify({
                lat,
                lng,
                steps: currentStepCount,
                timestamp,
            }),
        });

        return {
            lat,
            lng,
            steps: currentStepCount,
            timestamp,
        };
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
        const userLastStepsKey = `user:${userId}:last_steps`;
        const userStepsKey = `user:${userId}:steps`;

        await redisClient.del(userLocationKey);
        await redisClient.del(userLastStepsKey);
        await redisClient.del(userStepsKey);

        await redisClient.zRem(this.locationKey, userId.toString());
    }

    async isExistRemainCounts(userId: number, id: string): Promise<boolean> {
        const key = `user:${userId}:remain_counts:${id}`;
        return await redisClient.exists(key) === 1;
    }

    async getRemainCounts(userId: number, id: string): Promise<number[]> {
        const key = `user:${userId}:remain_counts:${id}`;
        const remainCounts = await redisClient.get(key) ?? "[]";

        return JSON.parse(remainCounts);
    }

    async setRemainCounts(userId: number, id: string, remainCounts: number[]): Promise<void> {
        const key = `user:${userId}:remain_counts:${id}`;

        const now = new Date();
        const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
        const secondsUntilMidnight = Math.floor((tomorrow.getTime() - now.getTime()) / 1000);

        await redisClient.setEx(key, secondsUntilMidnight, JSON.stringify(remainCounts));
    }
}

export default AdventureRedisRepository;
