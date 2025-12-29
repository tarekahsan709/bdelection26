import Redis from 'ioredis';

let redis: Redis | null = null;

function createRedisClient(): Redis | null {
  if (!process.env.REDIS_URL) {
    return null;
  }

  try {
    const client = new Redis(process.env.REDIS_URL, {
      maxRetriesPerRequest: 3,
      retryStrategy: (times) => {
        if (times > 3) return null;
        return Math.min(times * 100, 2000);
      },
    });

    client.on('error', () => {
      redis = null;
    });

    return client;
  } catch {
    return null;
  }
}

export function getRedis(): Redis | null {
  if (!redis && process.env.REDIS_URL) {
    redis = createRedisClient();
  }
  return redis;
}

export function isRedisAvailable(): boolean {
  return getRedis() !== null;
}
