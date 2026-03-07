// ============================================================
// BullMQ Worker process — Railway 배포용
// 6개 큐 처리: generation, regeneration, image-generation,
//              diagnosis, ab-test, analytics-aggregate
// ============================================================

import { Worker, type Job } from 'bullmq';
import IORedis from 'ioredis';

// Railway / Upstash Redis
const connection = new IORedis(process.env.REDIS_URL!, {
  maxRetriesPerRequest: null,
});

console.log('[Worker] Starting BullMQ workers...');

// ============================================================
// 1. Generation — 랜딩페이지 전체 생성 파이프라인
// ============================================================
const generationWorker = new Worker(
  'generation',
  async (job: Job) => {
    console.log(`[generation] Processing job ${job.id}`, job.data);
    const { projectId } = job.data as { projectId: string };

    const { runPipeline } = await import('../src/engine/pipeline');
    const result = await runPipeline(projectId, (progress) => {
      job.updateProgress(progress).catch(() => {});
    });

    console.log(`[generation] Project ${projectId} completed — cost: $${result.totalCost.toFixed(3)}, sections: ${result.totalSections}, images: ${result.totalImages}`);
    return { projectId, ...result, completedAt: new Date().toISOString() };
  },
  {
    connection,
    concurrency: 2,
    limiter: { max: 5, duration: 60_000 },
  },
);

// ============================================================
// 2. Regeneration — 특정 섹션 재생성
// ============================================================
const regenerationWorker = new Worker(
  'regeneration',
  async (job: Job) => {
    console.log(`[regeneration] Processing job ${job.id}`, job.data);
    const { projectId, sectionIds } = job.data as {
      projectId: string;
      sectionIds: string[];
    };

    // TODO: pipeline orchestrator 완성 후 활성화
    console.log(`[regeneration] Project ${projectId}, sections: ${sectionIds.join(',')}`);

    return { projectId, sectionIds, completedAt: new Date().toISOString() };
  },
  {
    connection,
    concurrency: 2,
  },
);

// ============================================================
// 3. Image Generation — AI 이미지 생성
// ============================================================
const imageWorker = new Worker(
  'image-generation',
  async (job: Job) => {
    console.log(`[image-generation] Processing job ${job.id}`, job.data);
    const { projectId, sectionId, prompt } = job.data as {
      projectId: string;
      sectionId: string;
      prompt: string;
      referenceImageUrl?: string;
    };

    // TODO: 파이프라인 컨텍스트에서 full args 전달 필요
    // const { runImageGeneration } = await import('../src/engine/image-generation');
    console.log(`[image-generation] Project ${projectId}, section ${sectionId}`);

    return { projectId, sectionId, prompt, completedAt: new Date().toISOString() };
  },
  {
    connection,
    concurrency: 3,
    limiter: { max: 10, duration: 60_000 },
  },
);

// ============================================================
// 4. Diagnosis — 랜딩페이지 성과 진단
// ============================================================
const diagnosisWorker = new Worker(
  'diagnosis',
  async (job: Job) => {
    console.log(`[diagnosis] Processing job ${job.id}`, job.data);
    const { projectId } = job.data as { projectId: string };

    const { runLearningLoop } = await import('../src/engine/12-learning-loop');
    const result = await runLearningLoop(projectId);

    return result;
  },
  {
    connection,
    concurrency: 1,
  },
);

// ============================================================
// 5. A/B Test — A/B 테스트 실행
// ============================================================
const abTestWorker = new Worker(
  'ab-test',
  async (job: Job) => {
    console.log(`[ab-test] Processing job ${job.id}`, job.data);
    const { projectId, testConfig } = job.data as {
      projectId: string;
      testConfig: Record<string, unknown>;
    };

    // A/B 테스트 로직 (Learning Loop 엔진의 일부)
    const { runLearningLoop } = await import('../src/engine/12-learning-loop');
    const result = await runLearningLoop(projectId);

    return { projectId, testConfig, result };
  },
  {
    connection,
    concurrency: 1,
  },
);

// ============================================================
// 6. Analytics Aggregate — 분석 데이터 집계
// ============================================================
const analyticsWorker = new Worker(
  'analytics-aggregate',
  async (job: Job) => {
    console.log(`[analytics-aggregate] Processing job ${job.id}`, job.data);
    const { projectId, period } = job.data as {
      projectId: string;
      period: string;
    };

    // 분석 집계 — 추후 확장
    console.log(`[analytics-aggregate] Aggregating ${period} for project ${projectId}`);

    return { projectId, period, completedAt: new Date().toISOString() };
  },
  {
    connection,
    concurrency: 1,
  },
);

// ============================================================
// 이벤트 핸들러
// ============================================================
const workers = [
  generationWorker,
  regenerationWorker,
  imageWorker,
  diagnosisWorker,
  abTestWorker,
  analyticsWorker,
];

for (const worker of workers) {
  worker.on('completed', (job) => {
    console.log(`[${worker.name}] Job ${job.id} completed`);
  });

  worker.on('failed', (job, err) => {
    console.error(`[${worker.name}] Job ${job?.id} failed:`, err.message);
  });

  worker.on('error', (err) => {
    console.error(`[${worker.name}] Worker error:`, err.message);
  });
}

// ============================================================
// Graceful Shutdown
// ============================================================
async function shutdown() {
  console.log('[Worker] Shutting down gracefully...');
  await Promise.all(workers.map((w) => w.close()));
  await connection.quit();
  process.exit(0);
}

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

console.log('[Worker] All workers started successfully');
console.log('[Worker] Queues:', workers.map((w) => w.name).join(', '));
