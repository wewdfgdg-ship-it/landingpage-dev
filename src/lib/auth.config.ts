import type { NextAuthConfig } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

// ============================================================
// Edge Runtime 호환 인증 설정 (middleware용)
// DB 없음 — JWT 검증 + 라우트 보호만 담당
// ============================================================

export const authConfig: NextAuthConfig = {
  providers: [
    // middleware에서 Credentials 프로바이더 인식용 (실제 authorize는 auth.ts에서)
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize() {
        // middleware에서는 호출 안 됨 — auth.ts의 authorize가 실행됨
        return null;
      },
    }),
  ],
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
