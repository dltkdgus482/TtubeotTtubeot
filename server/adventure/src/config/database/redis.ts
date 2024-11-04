import { Cluster } from 'ioredis';
import dotenv from 'dotenv';

dotenv.config();

const redisCluster = new Cluster(
  [
    { host: 'redis-cluster-0.redis-cluster-headless.ttubeot-adventure.svc.cluster.local', port: 6379 },
    { host: 'redis-cluster-1.redis-cluster-headless.ttubeot-adventure.svc.cluster.local', port: 6379 },
    { host: 'redis-cluster-2.redis-cluster-headless.ttubeot-adventure.svc.cluster.local', port: 6379 }
  ],
  {
    redisOptions: {
      password: process.env.REDIS_PASSWORD as string
    }
  }
);

redisCluster.on('error', (err: Error) => console.error('Redis Cluster Error', err));

redisCluster.on('connect', () => {
  console.log('Connected to Redis Cluster');
});

export default redisCluster;
