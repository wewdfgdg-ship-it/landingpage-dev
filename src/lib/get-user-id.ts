import { cookies } from 'next/headers';
import { decode } from 'next-auth/jwt';

/**
 * API Route에서 현재 로그인된 유저 ID를 가져옴
 * auth() 대신 JWT 쿠키를 직접 디코딩 (PrismaAdapter 호환 문제 회피)
 */
export async function getUserId(): Promise<string | null> {
  const cookieStore = await cookies();
  const secureName = '__Secure-authjs.session-token';
  const plainName = 'authjs.session-token';
  const isSecure = cookieStore.has(secureName);
  const token = cookieStore.get(isSecure ? secureName : plainName)?.value;

  if (!token) return null;

  try {
    const decoded = await decode({
      token,
      secret: process.env.AUTH_SECRET!,
      salt: isSecure ? secureName : plainName,
    });
    return (decoded?.id as string) ?? (decoded?.sub as string) ?? null;
  } catch {
    return null;
  }
}
