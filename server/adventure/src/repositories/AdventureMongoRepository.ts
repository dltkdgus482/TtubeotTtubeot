import client from '../config/database/mongo';
import { Collection, InsertOneResult, ObjectId } from 'mongodb';


class AdventureMongoRepository {
  private collection: Collection;

  constructor() {
    const db = client.db('adventure');
    this.collection = db.collection('userLocationData');
  }

  async insertUserLocationData(userId: number, locationData: { lat: number, lng: number, steps: number, timestamp: number }[]): Promise<string> {
    try {
      const result: InsertOneResult = await this.collection.insertOne({
        userId,
        gps_log: locationData,
      });
      return result.insertedId.toString();
    } catch (error) {
      console.error(`Failed to insert data for user ${userId}:`, error);
      throw error;
    }
  }

  async getUserLocationData(key: string): Promise<{ lat: number, lng: number, steps: number, timestamp: number }[]> {
    try {
      const result = await this.collection.findOne({ _id: new ObjectId(key) });
      return result?.gps_log ?? [];
    } catch (error) {
      console.error(`Failed to get data for key ${key}:`, error);
      throw error;
    }
  }
}

export default AdventureMongoRepository;
