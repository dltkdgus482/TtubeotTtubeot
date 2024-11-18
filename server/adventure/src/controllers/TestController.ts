import { Request, Response } from 'express';
import redisClient from '../config/database/redis';
import mongoClient from '../config/database/mongo';
import mysqlConnection from '../config/database/mysql';

class TestController {
  // Redis 테스트
  async testRedis(req: Request, res: Response) {
    try {
      await redisClient.set('test', 'Redis is connected');
      const value = await redisClient.get('test');
      res.json({ message: 'Redis connection successful', value });
    } catch (error) {
      res.status(500).json({ message: 'Redis connection failed', error });
    }
  }

  // MongoDB 테스트
  async testMongoDB(req: Request, res: Response) {
    try {
      const db = mongoClient.db('test_db'); // 테스트용 데이터베이스 이름
      const collection = db.collection('test_collection');
      await collection.insertOne({ message: 'MongoDB is connected' });
      const result = await collection.findOne({ message: 'MongoDB is connected' });
      res.json({ message: 'MongoDB connection successful', result });
    } catch (error) {
      res.status(500).json({ message: 'MongoDB connection failed', error });
    }
  }

  // MySQL 테스트
  async testMySQL(req: Request, res: Response) {
    try {
      const [rows]: [any[], any] = await mysqlConnection.query('SELECT 1 + 1 AS solution');
      res.json({ message: 'MySQL connection successful', solution: rows[0].solution });
    } catch (error) {
      res.status(500).json({ message: 'MySQL connection failed', error });
    }
  }
}

export default new TestController();
