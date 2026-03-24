export const runtime = 'nodejs';
export const maxDuration = 30;

import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { r2 } from '@/lib/r2';
import { PutObjectCommand } from '@aws-sdk/client-s3';

const BUCKET = process.env.R2_BUCKET_NAME?.replace(/"/g, '') ?? '';
const MAX_SIZE = 10 * 1024 * 1024; // 10MB

export async function POST(req: Request): Promise<NextResponse> {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: '인증 필요' }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get('file') as File | null;

  if (!file) {
    return NextResponse.json({ error: '파일 필수' }, { status: 400 });
  }

  if (!file.type.startsWith('image/')) {
    return NextResponse.json({ error: '이미지만 업로드 가능' }, { status: 400 });
  }

  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: '10MB 초과' }, { status: 400 });
  }

  const storageKey = `uploads/${session.user.id}/${Date.now()}_${file.name}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  await r2.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: storageKey,
      Body: buffer,
      ContentType: file.type,
    }),
  );

  const cdnUrl = process.env.R2_CDN_URL?.replace(/"/g, '') ?? '';

  return NextResponse.json({ storageKey, url: `${cdnUrl}/${storageKey}` });
}
