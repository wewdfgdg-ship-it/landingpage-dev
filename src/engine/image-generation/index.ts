import { generateImage } from '@/lib/ai/gemini';
import { r2, getCdnUrl } from '@/lib/r2';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { db } from '@/lib/db';
import type { CopyBlocks } from '@/engine/05-psychological-copy/types';
import type { LayoutConfig } from '@/engine/08-layout-intelligence/types';
import type {
  SectionImageRequest,
  SectionImageResult,
  ImageGenerationOutput,
} from './types';
import { IMAGE_REQUIRED_PATTERNS } from './types';
import { buildImagePrompt } from './prompts';

export type { ImageGenerationOutput, SectionImageResult } from './types';

// ============================================================
// Image Generation Engine
// 섹션 imageDirection → Gemini 이미지 생성 → R2 업로드 → CDN URL
// ============================================================

const BUCKET = process.env.R2_BUCKET_NAME!;
const MAX_CONCURRENT = 3;

/** 이미지가 필요한 섹션 필터링 */
function extractImageRequests(
  copyBlocks: CopyBlocks,
  layoutConfig: LayoutConfig,
): SectionImageRequest[] {
  const requests: SectionImageRequest[] = [];

  for (const section of layoutConfig.sections) {
    // 이미지 영역이 있는 패턴만 필터링
    if (!IMAGE_REQUIRED_PATTERNS.has(section.selectedPattern)) continue;

    const sectionCopy = copyBlocks.sections.find(
      (s) => s.sectionOrder === section.order,
    );

    const direction = sectionCopy?.copy.imageDirection;
    if (!direction) continue;

    requests.push({
      sectionOrder: section.order,
      sectionType: section.sectionType,
      patternId: section.selectedPattern,
      imageDirection: direction,
    });
  }

  return requests;
}

/** 단일 이미지 생성 + R2 업로드 */
async function generateAndUpload(
  req: SectionImageRequest,
  projectId: string,
  productName: string,
  industry: string,
  moodPreset: string,
  referenceImageBase64?: string,
): Promise<SectionImageResult> {
  const prompt = buildImagePrompt(req, productName, industry, moodPreset);

  // Gemini 이미지 생성
  const result = await generateImage(prompt, referenceImageBase64);

  // R2 업로드
  const ext = result.mimeType === 'image/png' ? 'png' : 'jpg';
  const storageKey = `projects/${projectId}/sections/s${req.sectionOrder}.${ext}`;

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
  await db.generatedImage.create({
    data: {
      projectId,
      storageKey,
      cdnUrl,
      mimeType: result.mimeType,
      fileSize: result.imageData.length,
      prompt,
      sectionType: req.sectionType,
      model: result.model,
      cost: result.cost,
    },
  });

  return {
    sectionOrder: req.sectionOrder,
    cdnUrl,
    storageKey,
    cost: result.cost,
  };
}

/** 병렬 처리 (최대 MAX_CONCURRENT개 동시) */
async function processInBatches<T, R>(
  items: T[],
  concurrency: number,
  fn: (item: T) => Promise<R>,
): Promise<PromiseSettledResult<R>[]> {
  const results: PromiseSettledResult<R>[] = [];

  for (let i = 0; i < items.length; i += concurrency) {
    const batch = items.slice(i, i + concurrency);
    const batchResults = await Promise.allSettled(batch.map(fn));
    results.push(...batchResults);
  }

  return results;
}

// --- 메인 엔진 ---

export async function runImageGeneration(
  projectId: string,
  productName: string,
  industry: string,
  moodPreset: string,
  copyBlocks: CopyBlocks,
  layoutConfig: LayoutConfig,
  referenceImageBase64?: string,
): Promise<ImageGenerationOutput> {
  const requests = extractImageRequests(copyBlocks, layoutConfig);

  if (requests.length === 0) {
    return { images: [], totalCost: 0, totalImages: 0, failedSections: [] };
  }

  const results = await processInBatches(requests, MAX_CONCURRENT, (req) =>
    generateAndUpload(req, projectId, productName, industry, moodPreset, referenceImageBase64),
  );

  const images: SectionImageResult[] = [];
  const failedSections: number[] = [];
  let totalCost = 0;

  results.forEach((result, idx) => {
    if (result.status === 'fulfilled') {
      images.push(result.value);
      totalCost += result.value.cost;
    } else {
      failedSections.push(requests[idx].sectionOrder);
      console.error(
        `[ImageGen] 섹션 ${requests[idx].sectionOrder} 실패:`,
        result.reason,
      );
    }
  });

  return {
    images,
    totalCost,
    totalImages: images.length,
    failedSections,
  };
}
