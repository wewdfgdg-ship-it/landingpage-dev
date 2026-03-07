import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getUploadUrl } from '@/lib/r2';

export async function POST(req: Request): Promise<NextResponse> {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: '인증 필요' }, { status: 401 });
  }

  const body = (await req.json()) as { filename: string; contentType: string };
  const { filename, contentType } = body;

  if (!filename || !contentType) {
    return NextResponse.json({ error: '파일명과 타입 필수' }, { status: 400 });
  }

  if (!contentType.startsWith('image/')) {
    return NextResponse.json({ error: '이미지만 업로드 가능' }, { status: 400 });
  }

  const storageKey = `uploads/${session.user.id}/${Date.now()}_${filename}`;
  const uploadUrl = await getUploadUrl(storageKey, contentType);

  return NextResponse.json({ uploadUrl, storageKey });
}
