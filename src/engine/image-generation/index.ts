import { generateImage } from '@/lib/ai/gemini';
import { r2, getCdnUrl } from '@/lib/r2';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { db } from '@/lib/db';
import { getTemplate } from '@/engine/10-code-engine/template-registry';
import type { CopyBlocks } from '@/engine/05-psychological-copy/types';
import type { LayoutConfig } from '@/engine/08-layout-intelligence/types';
import type {
  SectionImageRequest,
  SectionImageResult,
  ImageGenerationOutput,
} from './types';
import { IMAGE_REQUIRED_PATTERNS } from './types';
import { processChromakey } from './chromakey';

export type { ImageGenerationOutput, SectionImageResult } from './types';

// ============================================================
// Image Generation Engine
// 섹션 imageDirection → Gemini 이미지 생성 → R2 업로드 → CDN URL
// ============================================================

const BUCKET = process.env.R2_BUCKET_NAME;
if (!BUCKET) {
  throw new Error('R2_BUCKET_NAME must be set');
}
const MAX_CONCURRENT = 3;

/** imageDirection을 Gemini 프롬프트로 변환 */
function buildImagePrompt(
  req: SectionImageRequest,
  productName: string,
  industry: string,
  moodPreset: string,
): string {
  const sectionContext = getSectionContext(req.sectionType);

  return `당신은 전문 상업용 제품 사진작가입니다.

제품: ${productName}
산업: ${industry}
분위기: ${moodPreset}
섹션 용도: ${sectionContext}

다음 지시에 따라 고품질 상업용 이미지를 생성하세요:
${req.imageDirection}

요구사항:
- 깨끗하고 전문적인 상업 사진 스타일
- 텍스트나 글자를 이미지에 포함하지 마세요
- 제품과 관련된 시각적 요소만 포함
- 4:3 가로 비율
- 밝고 선명한 색감
${req.cutout
    ? `- 배경은 반드시 순수 녹색(#00FF00) 단색으로 채워주세요
- 피사체와 배경 사이에 명확한 경계를 유지하세요
- 배경에 그림자, 그라데이션, 패턴을 넣지 마세요`
    : '- 배경은 심플하게'}`;
}

/** 섹션 타입별 컨텍스트 설명 */
function getSectionContext(sectionType: string): string {
  const contextMap: Record<string, string> = {
    hero: '랜딩페이지 메인 히어로 영역 — 시선을 사로잡는 대표 이미지',
    feature: '기능/특징 소개 영역 — 제품의 핵심 가치를 보여주는 이미지',
    benefit: '혜택 설명 영역 — 사용자가 얻는 이점을 시각화',
    social_proof: '사회적 증거 영역 — 신뢰를 구축하는 이미지',
    how_it_works: '사용 방법 영역 — 단계별 프로세스를 설명하는 이미지',
    comparison: '비교 영역 — 제품의 차별점을 보여주는 이미지',
  };
  return contextMap[sectionType] ?? '제품과 관련된 전문적인 이미지';
}

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

    // 템플릿 설정에서 cutout 여부 확인
    const template = getTemplate(section.selectedPattern);
    const cutout = template?.config.imageSpec.cutout ?? false;

    requests.push({
      sectionOrder: section.order,
      sectionType: section.sectionType,
      patternId: section.selectedPattern,
      imageDirection: direction,
      cutout,
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

  // 크로마키 처리 (cutout 요청 시)
  let finalImageData = result.imageData;
  let finalMimeType = result.mimeType;

  if (req.cutout) {
    const processed = await processChromakey(result.imageData, result.mimeType);
    finalImageData = processed.imageData;
    finalMimeType = 'image/png'; // 크로마키 적용 시 투명도 지원을 위해 PNG 강제
  }

  // R2 업로드
  const ext = finalMimeType === 'image/png' ? 'png' : 'jpg';
  const storageKey = `projects/${projectId}/sections/s${req.sectionOrder}.${ext}`;

  await r2.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: storageKey,
      Body: finalImageData,
      ContentType: finalMimeType,
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
  preAssignedImages?: Map<number, string>,
): Promise<ImageGenerationOutput> {
  const allRequests = extractImageRequests(copyBlocks, layoutConfig);

  if (allRequests.length === 0) {
    return { images: [], totalCost: 0, totalImages: 0, failedSections: [] };
  }

  // 원본 이미지가 배치된 섹션은 AI 생성 스킵
  const images: SectionImageResult[] = [];
  const aiRequests: SectionImageRequest[] = [];

  for (const req of allRequests) {
    const userCdnUrl = preAssignedImages?.get(req.sectionOrder);
    if (userCdnUrl) {
      images.push({
        sectionOrder: req.sectionOrder,
        cdnUrl: userCdnUrl,
        storageKey: '',
        cost: 0,
      });
    } else {
      aiRequests.push(req);
    }
  }

  // 원본이 없는 섹션만 AI 생성
  let totalCost = 0;
  const failedSections: number[] = [];

  if (aiRequests.length > 0) {
    const results = await processInBatches(aiRequests, MAX_CONCURRENT, (req) =>
      generateAndUpload(req, projectId, productName, industry, moodPreset, referenceImageBase64),
    );

    results.forEach((result, idx) => {
      if (result.status === 'fulfilled') {
        images.push(result.value);
        totalCost += result.value.cost;
      } else {
        failedSections.push(aiRequests[idx].sectionOrder);
        // eslint-disable-next-line no-console
        console.error(
          `[ImageGen] 섹션 ${aiRequests[idx].sectionOrder} 실패:`,
          result.reason,
        );
      }
    });
  }

  return {
    images,
    totalCost,
    totalImages: images.length,
    failedSections,
  };
}
