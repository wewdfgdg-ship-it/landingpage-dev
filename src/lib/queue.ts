import { Queue } from 'bullmq';
import IORedis from 'ioredis';

const redisUrl = process.env.REDIS_URL;
if (!redisUrl) {
  throw new Error('REDIS_URL must be set');
}

const connection = new IORedis(redisUrl, {
  maxRetriesPerRequest: null,
});

export const generationQueue = new Queue('generation', {
  connection,
  defaultJobOptions: {
    removeOnComplete: 100,
    removeOnFail: 50,
    attempts: 2,
  },
});

export const regenerationQueue = new Queue('regeneration', {
  connection,
  defaultJobOptions: {
    removeOnComplete: 100,
    removeOnFail: 50,
    attempts: 2,
  },
});

export const imageGenerationQueue = new Queue('image-generation', {
  connection,
  defaultJobOptions: {
    removeOnComplete: 200,
    removeOnFail: 50,
    attempts: 3,
  },
});

export const diagnosisQueue = new Queue('diagnosis', {
  connection,
  defaultJobOptions: {
    removeOnComplete: 50,
    removeOnFail: 20,
  },
});

export const abTestQueue = new Queue('ab-test', {
  connection,
  defaultJobOptions: {
    removeOnComplete: 50,
    removeOnFail: 20,
  },
});

export const analyticsQueue = new Queue('analytics-aggregate', {
  connection,
  defaultJobOptions: {
    removeOnComplete: 30,
    removeOnFail: 10,
  },
});
