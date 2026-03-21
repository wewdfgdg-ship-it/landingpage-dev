import { db } from '@/lib/db';
import { getUserId } from '@/lib/get-user-id';
import { generateImage } from '@/lib/ai/gemini';
import { r2, getCdnUrl } from '@/lib/r2';
import { PutObjectCommand } from '@aws-sdk/client-s3';

// ============================================================
// 단일 섹션 이미지 재생성 API
// POST /api/projects/[id]/regenerate-image
// body: { sectionOrder: number, imageDirection: string }
// ============================================================

const BUCKET = process.env.R2_BUCKET_NAME!;

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
): Promise<Response> {
  const userId = await getUserId();
  if (!userId) {
    return Response.json({ error: '인증 필요' }, { status: 401 });
  }

  const { id } = await params;

  const body = (await req.json()) as {
    sectionOrder?: number;
    imageDirection?: string;
  };

  if (!body.sectionOrder || !body.imageDirection) {
    return Response.json(
      { error: 'sectionOrder와 imageDirection 필수' },
      { status: 400 },
    );
  }

  // 권한 확인
  const membership = await db.membership.findFirst({
    where: { userId },
    select: { orgId: true },
  });

  if (!membership) {
    return Response.json({ error: '조직 없음' }, { status: 403 });
  }

  const project = await db.project.findFirst({
    where: { id, orgId: membership.orgId, deletedAt: null },
    select: {
      id: true,
      status: true,
      inputData: true,
      styleConfig: true,
    },
  });

  if (!project) {
    return Response.json({ error: '프로젝트 없음' }, { status: 404 });
  }

  const inputData = project.inputData as Record<string, unknown> | null;
  const basicInfo = inputData?.basicInfo as Record<string, string> | undefined;
  const productName = basicInfo?.productName ?? '제품';
  const industry = basicInfo?.industry ?? 'general';

  const styleData = project.styleConfig as Record<string, unknown> | null;
  const mood = (styleData?.mood as string) ?? 'modern';

  // 이미지 생성
  const prompt = `당신은 전문 상업용 제품 사진작가입니다.

제품: ${productName}
산업: ${industry}
분위기: ${mood}

다음 지시에 따라 고품질 상업용 이미지를 생성하세요:
${body.imageDirection}

요구사항:
- 깨끗하고 전문적인 상업 사진 스타일
- 텍스트나 글자를 이미지에 포함하지 마세요
- 제품과 관련된 시각적 요소만 포함
- 4:3 가로 비율
- 밝고 선명한 색감
- 배경은 심플하게`;

  try {
    const result = await generateImage(prompt);

    // R2 업로드
    const ext = result.mimeType === 'image/png' ? 'png' : 'jpg';
    const storageKey = `projects/${id}/sections/s${body.sectionOrder}-${Date.now()}.${ext}`;

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
        projectId: id,
        storageKey,
        cdnUrl,
        mimeType: result.mimeType,
        fileSize: result.imageData.length,
        prompt,
        sectionType: `section-${body.sectionOrder}`,
        model: result.model,
        cost: result.cost,
      },
    });

    // copyBlocks의 해당 섹션 imageUrl도 업데이트
    const copyBlocks = project.inputData
      ? ((await db.project.findUnique({
          where: { id },
          select: { copyBlocks: true },
        })) as { copyBlocks: unknown })
      : null;

    if (copyBlocks?.copyBlocks) {
      const blocks = copyBlocks.copyBlocks as {
        sections: Array<{
          sectionOrder: number;
          copy: Record<string, unknown>;
          [key: string]: unknown;
        }>;
        [key: string]: unknown;
      };
      const section = blocks.sections.find(
        (s) => s.sectionOrder === body.sectionOrder,
      );
      if (section) {
        section.copy.imageUrl = cdnUrl;
        await db.project.update({
          where: { id },
          data: { copyBlocks: JSON.parse(JSON.stringify(blocks)) },
        });
      }
    }

    return Response.json({
      cdnUrl,
      cost: result.cost,
      sectionOrder: body.sectionOrder,
    });
  } catch (error) {
    return Response.json(
      {
        error:
          error instanceof Error ? error.message : '이미지 생성 실패',
      },
      { status: 500 },
    );
  }
}
