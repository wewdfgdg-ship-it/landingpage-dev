import { auth } from '@/lib/auth';
import { db } from '@/lib/db';

// ============================================================
// 관리자 인증 헬퍼
// ============================================================

export interface AdminUser {
  id: string;
  email: string;
  name: string | null;
}

/** 현재 세션이 관리자인지 확인. 아니면 null 반환. */
export async function requireAdmin(): Promise<AdminUser | null> {
  const session = await auth();
  if (!session?.user?.id) return null;

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, email: true, name: true, isAdmin: true },
  });

  if (!user?.isAdmin) return null;

  return { id: user.id, email: user.email, name: user.name };
}
