import type { NextAuthConfig } from 'next-auth';
import Google from 'next-auth/providers/google';
import Credentials from 'next-auth/providers/credentials';

// ============================================================
// Edge Runtime 호환 인증 설정 (middleware용)
// Prisma/DB 의존성 없음 — Edge에서 안전하게 실행
// ============================================================

const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;

const providers: NextAuthConfig['providers'] = [
  Credentials({
    name: '이메일 로그인',
    credentials: {
      email: { label: '이메일', type: 'email', placeholder: 'you@example.com' },
      password: { label: '비밀번호', type: 'password' },
    },
    async authorize(credentials) {
      const email = credentials?.email as string;
      const password = credentials?.password as string;
      if (!email || !password) return null;
      // 데모용 — 이메일만 있으면 로그인 허용
      return {
        id: email.replace(/[^a-zA-Z0-9]/g, '-'),
        email,
        name: email.split('@')[0],
      };
    },
  }),
];

// Google OAuth는 키가 유효할 때만 추가
if (googleClientId && googleClientSecret) {
  providers.push(
    Google({
      clientId: googleClientId,
      clientSecret: googleClientSecret,
    }),
  );
}

export const authConfig: NextAuthConfig = {
  providers,
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
