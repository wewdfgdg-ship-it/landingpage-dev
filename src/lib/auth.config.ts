import type { NextAuthConfig } from 'next-auth';

// ============================================================
// Edge Runtime 호환 인증 설정 (middleware용)
// DB 없음 — JWT 검증 + 라우트 보호만 담당
// providers는 비워둠 — 실제 인증은 auth.ts에서 처리
// ============================================================

export const authConfig: NextAuthConfig = {
  providers: [],
  session: { strategy: 'jwt' },
  pages: { signIn: '/login' },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token.id && session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
};
