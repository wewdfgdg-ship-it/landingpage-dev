import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  const session = await auth();
  if (!session?.user?.id) {
    return new NextResponse('인증 필요', { status: 401 });
  }

  const { id } = await params;

  const membership = await db.membership.findFirst({
    where: { userId: session.user.id },
    select: { orgId: true },
  });

  if (!membership) {
    return new NextResponse('조직 없음', { status: 403 });
  }

  const project = await db.project.findFirst({
    where: { id, orgId: membership.orgId, deletedAt: null },
    select: { generatedHtml: true },
  });

  if (!project?.generatedHtml) {
    return new NextResponse('<html><body><p>생성된 페이지가 없습니다</p></body></html>', {
      status: 200,
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });
  }

  return new NextResponse(project.generatedHtml, {
    status: 200,
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
}
