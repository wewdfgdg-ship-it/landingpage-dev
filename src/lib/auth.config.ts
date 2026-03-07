import type { NextAuthConfig } from 'next-auth';
import Google from 'next-auth/providers/google';

// ============================================================
// Edge Runtime 호환 인증 설정 (middleware용)
// Prisma/DB 의존성 없음 — Edge에서 안전하게 실행
// ============================================================

export const authConfig: NextAuthConfig = {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
  },
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
