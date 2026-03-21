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
    const { projectId, sectionOrders, imageDirections } = job.data as {
      projectId: string;
      sectionOrders: number[];
      imageDirections?: Record<number, string>;
    };

    // DB에서 프로젝트 데이터 조회
    const { PrismaClient } = await import('../src/generated/prisma/client');
    const { PrismaPg } = await import('@prisma/adapter-pg');
    const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
    const prisma = new PrismaClient({ adapter });

    try {
      const project = await prisma.project.findUnique({ where: { id: projectId } });
      if (!project) throw new Error('프로젝트를 찾을 수 없습니다');

      const inputData = project.inputData as Record<string, unknown>;
      const basicInfo = inputData?.basicInfo as Record<string, string>;
      const productName = basicInfo?.productName ?? '제품';
      const industry = basicInfo?.industry ?? 'general';

      const existingCopyBlocks = project.copyBlocks as {
        sections: Array<{ sectionOrder: number; copy: Record<string, unknown>; [key: string]: unknown }>;
        [key: string]: unknown;
      } | null;

      if (!existingCopyBlocks) throw new Error('기존 카피블록이 없습니다');

      // 섹션별 이미지 재생성
      const { generateImage } = await import('../src/lib/ai/gemini');
      const { r2, getCdnUrl } = await import('../src/lib/r2');
      const { PutObjectCommand } = await import('@aws-sdk/client-s3');
      const BUCKET = process.env.R2_BUCKET_NAME!;

      const styleData = project.styleConfig as Record<string, unknown> | null;
      const mood = (styleData?.mood as string) ?? 'modern';

      const results: Array<{ sectionOrder: number; cdnUrl: string; cost: number }> = [];

      for (const order of sectionOrders) {
        const section = existingCopyBlocks.sections.find((s) => s.sectionOrder === order);
        if (!section) continue;

        const direction = imageDirections?.[order]
          ?? (section.copy.imageDirection as string)
          ?? '';
        if (!direction) continue;

        const prompt = `당신은 전문 상업용 제품 사진작가입니다.\n\n제품: ${productName}\n산업: ${industry}\n분위기: ${mood}\n\n다음 지시에 따라 고품질 상업용 이미지를 생성하세요:\n${direction}\n\n요구사항:\n- 깨끗하고 전문적인 상업 사진 스타일\n- 텍스트나 글자를 이미지에 포함하지 마세요\n- 제품과 관련된 시각적 요소만 포함\n- 4:3 가로 비율\n- 밝고 선명한 색감\n- 배경은 심플하게`;

        try {
          const result = await generateImage(prompt);
          const ext = result.mimeType === 'image/png' ? 'png' : 'jpg';
          const storageKey = `projects/${projectId}/sections/s${order}-${Date.now()}.${ext}`;

          await r2.send(
            new PutObjectCommand({
              Bucket: BUCKET,
              Key: storageKey,
              Body: result.imageData,
              ContentType: result.mimeType,
              CacheControl: 'public, max-age=31536000',
            }),
          );

          const cdnUrl = getCdnUrl(storageKey);

          await prisma.generatedImage.create({
            data: {
              projectId,
              storageKey,
              cdnUrl,
              mimeType: result.mimeType,
              fileSize: result.imageData.length,
              prompt,
              sectionType: `section-${order}`,
              model: result.model,
              cost: result.cost,
            },
          });

          // copyBlocks 업데이트
          section.copy.imageUrl = cdnUrl;
          results.push({ sectionOrder: order, cdnUrl, cost: result.cost });

          job.updateProgress({ completed: results.length, total: sectionOrders.length }).catch(() => {});
        } catch (err) {
          console.error(`[regeneration] 섹션 ${order} 이미지 재생성 실패:`, err instanceof Error ? err.message : err);
        }
      }

      // 업데이트된 copyBlocks 저장
      await prisma.project.update({
        where: { id: projectId },
        data: { copyBlocks: JSON.parse(JSON.stringify(existingCopyBlocks)) },
      });

      console.log(`[regeneration] Project ${projectId}, ${results.length}/${sectionOrders.length} 섹션 재생성 완료`);
      return { projectId, results, completedAt: new Date().toISOString() };
    } finally {
      await prisma.$disconnect();
    }
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
    const { projectId, sectionOrder, imageDirection, referenceImageBase64 } = job.data as {
      projectId: string;
      sectionOrder: number;
      imageDirection: string;
      referenceImageBase64?: string;
    };

    const { PrismaClient } = await import('../src/generated/prisma/client');
    const { PrismaPg } = await import('@prisma/adapter-pg');
    const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
    const prisma = new PrismaClient({ adapter });

    try {
      const project = await prisma.project.findUnique({
        where: { id: projectId },
        select: { inputData: true, styleConfig: true, copyBlocks: true },
      });
      if (!project) throw new Error('프로젝트를 찾을 수 없습니다');

      const inputData = project.inputData as Record<string, unknown>;
      const basicInfo = inputData?.basicInfo as Record<string, string>;
      const productName = basicInfo?.productName ?? '제품';
      const industry = basicInfo?.industry ?? 'general';
      const styleData = project.styleConfig as Record<string, unknown> | null;
      const mood = (styleData?.mood as string) ?? 'modern';

      const prompt = `당신은 전문 상업용 제품 사진작가입니다.\n\n제품: ${productName}\n산업: ${industry}\n분위기: ${mood}\n\n다음 지시에 따라 고품질 상업용 이미지를 생성하세요:\n${imageDirection}\n\n요구사항:\n- 깨끗하고 전문적인 상업 사진 스타일\n- 텍스트나 글자를 이미지에 포함하지 마세요\n- 제품과 관련된 시각적 요소만 포함\n- 4:3 가로 비율\n- 밝고 선명한 색감\n- 배경은 심플하게`;

      const { generateImage } = await import('../src/lib/ai/gemini');
      const result = await generateImage(prompt, referenceImageBase64);

      // R2 업로드
      const { r2, getCdnUrl } = await import('../src/lib/r2');
      const { PutObjectCommand } = await import('@aws-sdk/client-s3');
      const BUCKET = process.env.R2_BUCKET_NAME!;
      const ext = result.mimeType === 'image/png' ? 'png' : 'jpg';
      const storageKey = `projects/${projectId}/sections/s${sectionOrder}-${Date.now()}.${ext}`;

      await r2.send(
        new PutObjectCommand({
          Bucket: BUCKET,
          Key: storageKey,
          Body: result.imageData,
          ContentType: result.mimeType,
          CacheControl: 'public, max-age=31536000',
        }),
      );

      const cdnUrl = getCdnUrl(storageKey);

      // DB 기록
      await prisma.generatedImage.create({
        data: {
          projectId,
          storageKey,
          cdnUrl,
          mimeType: result.mimeType,
          fileSize: result.imageData.length,
          prompt,
          sectionType: `section-${sectionOrder}`,
          model: result.model,
          cost: result.cost,
        },
      });

      // copyBlocks 이미지 URL 업데이트
      const copyBlocks = project.copyBlocks as {
        sections: Array<{ sectionOrder: number; copy: Record<string, unknown>; [key: string]: unknown }>;
        [key: string]: unknown;
      } | null;

      if (copyBlocks) {
        const section = copyBlocks.sections.find((s) => s.sectionOrder === sectionOrder);
        if (section) {
          section.copy.imageUrl = cdnUrl;
          await prisma.project.update({
            where: { id: projectId },
            data: { copyBlocks: JSON.parse(JSON.stringify(copyBlocks)) },
          });
        }
      }

      console.log(`[image-generation] Project ${projectId}, section ${sectionOrder} — cdnUrl: ${cdnUrl}, cost: $${result.cost.toFixed(4)}`);
      return { projectId, sectionOrder, cdnUrl, cost: result.cost, completedAt: new Date().toISOString() };
    } finally {
      await prisma.$disconnect();
    }
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
// 7. Crawl — 레퍼런스 이미지 크롤링
// ============================================================
const crawlWorker = new Worker(
  'crawl',
  async (job: Job) => {
    console.log(`[crawl] Processing job ${job.id}`, job.data);

    const { runCrawlJob } = await import('../src/engine/crawler');
    const jobData = job.data as { crawlJobId: string };
    const result = await runCrawlJob(jobData.crawlJobId, undefined, (progress) => {
      // 진행률 보고 + Lock 연장 (장시간 크롤링 보호)
      job.updateProgress(progress).catch(() => {});
      job.extendLock(job.token ?? '', 5 * 60 * 1000).catch(() => {});
    });

    console.log(`[crawl] Job ${job.id} done — ${result.collected} sections from ${result.totalPages} pages`);
    return result;
  },
  {
    connection,
    concurrency: 2,
    limiter: { max: 5, duration: 60_000 },
    lockDuration: 5 * 60 * 1000, // 5분 Lock (진행률 보고 시 연장)
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
  crawlWorker,
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

// ============================================================
// 스테일 작업 복구 — Worker 크래시 후 RUNNING 상태로 남은 작업 처리
// ============================================================
async function recoverStaleCrawlJobs(): Promise<void> {
  try {
    // Worker용 DB 연결 (Prisma 7 + PrismaPg 어댑터)
    const { PrismaClient } = await import('../src/generated/prisma/client');
    const { PrismaPg } = await import('@prisma/adapter-pg');
    const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
    const prisma = new PrismaClient({ adapter });

    // 30분 이상 RUNNING 상태인 CrawlJob → QUEUED로 되돌리고 재큐잉
    const staleThreshold = new Date(Date.now() - 30 * 60 * 1000);
    const staleJobs = await prisma.crawlJob.findMany({
      where: {
        status: 'RUNNING',
        startedAt: { lt: staleThreshold },
      },
    });

    if (staleJobs.length > 0) {
      console.log(`[Worker] 스테일 작업 ${staleJobs.length}개 발견 — 복구 시작`);
      for (const sj of staleJobs) {
        await prisma.crawlJob.update({
          where: { id: sj.id },
          data: { status: 'QUEUED', startedAt: null, collected: 0, errorMsg: null },
        });

        const { crawlQueue: cq } = await import('../src/lib/queue');
        await cq.add('crawl', {
          crawlJobId: sj.id,
          sectionType: sj.sectionType,
          industry: sj.industry,
          treatment: sj.treatment,
          count: sj.count,
          sourceSites: sj.sourceSites,
          keywords: sj.keywords,
          memo: sj.memo,
        }, {
          jobId: `${sj.id}-retry-${Date.now()}`,
        });

        console.log(`[Worker] 스테일 작업 ${sj.id} 재큐잉 완료`);
      }
    }

    await prisma.$disconnect();
  } catch (err) {
    console.error('[Worker] 스테일 작업 복구 실패:', err instanceof Error ? err.message : err);
  }
}

// 시작 시 복구 실행
recoverStaleCrawlJobs().catch(() => {});

console.log('[Worker] All workers started successfully');
console.log('[Worker] Queues:', workers.map((w) => w.name).join(', '));
