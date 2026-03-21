import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { auth } from '@/lib/auth';
import { uploadBuffer, getCdnUrl } from '@/lib/r2';

const SECTION_TYPES = [
  'HEADER_BANNER', 'KEY_FEATURES', 'FEATURE_DETAIL_1', 'FEATURE_DETAIL_2',
  'FEATURE_DETAIL_3', 'SPECS', 'HOW_TO_USE', 'TARGET_PERSONA', 'BEFORE_AFTER',
  'LIFESTYLE', 'CERTIFICATION', 'FAQ', 'REVIEWS', 'SHIPPING', 'CTA',
  'STATS_NUMBERS', 'COMPETITOR_COMPARE', 'BRAND_STORY', 'PACKAGE_CONTENTS',
  'PHOTO_REVIEWS', 'SNS_VIRAL', 'BUNDLE_SET', 'LIMITED_OFFER', 'REFUND_POLICY',
  'CUSTOMER_SERVICE', 'PRICE_TABLE',
] as const;

const INDUSTRIES = [
  'beauty', 'food', 'fashion', 'electronics', 'furniture', 'kids', 'pets',
  'sports', 'saas', 'education', 'finance', 'realestate', 'travel', 'clinic',
  'legal', 'enterprise', 'marketing', 'consulting',
] as const;

const TREATMENTS = ['photo', 'text', 'graphic', 'animation'] as const;

export async function POST(req: Request): Promise<NextResponse> {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Î°úÍ∑∏???ÑÏöî' }, { status: 401 });
  const adminUser = await db.user.findUnique({ where: { id: session.user.id }, select: { isAdmin: true } });
  if (!adminUser?.isAdmin) return NextResponse.json({ error: 'Í¥ÄÎ¶¨Ïûê Í∂åÌïú ?ÑÏöî' }, { status: 403 });

  const formData = await req.formData();
  const file = formData.get('file') as File | null;
  const sectionType = formData.get('sectionType') as string | null;
  const industry = formData.get('industry') as string | null;
  const treatment = formData.get('treatment') as string | null;
  const sourceUrl = formData.get('sourceUrl') as string | null;

  if (!file || !sectionType || !industry || !treatment) {
    return NextResponse.json({ error: '?åÏùº, ?πÏÖò?Ä?? ?ÖÏ¢Ö, ?∏Î¶¨?∏Î®º???ÑÏàò' }, { status: 400 });
  }

  if (!file.type.startsWith('image/')) {
    return NextResponse.json({ error: '?¥Î?ÏßÄ ?åÏùºÎß??ÖÎ°ú??Í∞Ä?? }, { status: 400 });
  }

  if (!SECTION_TYPES.includes(sectionType as typeof SECTION_TYPES[number])) {
    return NextResponse.json({ error: '?òÎ™ª???πÏÖò ?Ä?? }, { status: 400 });
  }
  if (!INDUSTRIES.includes(industry as typeof INDUSTRIES[number])) {
    return NextResponse.json({ error: '?òÎ™ª???ÖÏ¢Ö' }, { status: 400 });
  }
  if (!TREATMENTS.includes(treatment as typeof TREATMENTS[number])) {
    return NextResponse.json({ error: '?òÎ™ª???∏Î¶¨?∏Î®º?? }, { status: 400 });
  }

  // ?åÏùº ??Buffer ??R2 ?ÖÎ°ú??
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const ext = file.name.split('.').pop() ?? 'jpg';
  const storageKey = `references/${sectionType}/${industry}/${Date.now()}.${ext}`;

  await uploadBuffer(storageKey, buffer, file.type);
  const imageUrl = getCdnUrl(storageKey);

  // DB ?±Î°ù (APPROVED ?ÅÌÉúÎ°?
  const id = `ref-${Date.now()}`;
  await db.$executeRaw`
    INSERT INTO "SectionReference" (id, "sectionType", industry, treatment, status, "imageUrl", "sourceUrl", "createdAt", "updatedAt")
    VALUES (${id}, ${sectionType}, ${industry}, ${treatment}, 'APPROVED', ${imageUrl}, ${sourceUrl ?? null}, NOW(), NOW())
  `;

  return NextResponse.json({ id, imageUrl, status: 'APPROVED' }, { status: 201 });
}
