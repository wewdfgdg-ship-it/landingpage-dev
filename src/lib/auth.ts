import NextAuth from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import Credentials from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google';
import { db } from '@/lib/db';
import type { NextAuthConfig } from 'next-auth';

// ============================================================
// 서버 전용 인증 설정 (API routes, Server Components용)
// PrismaAdapter + DB 접근 가능 — Node.js Runtime 전용
// ============================================================

const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;

const providers: NextAuthConfig['providers'] = [
  Credentials({
    name: '이메일 로그인',
    credentials: {
      email: { label: '이메일', type: 'email' },
      password: { label: '비밀번호', type: 'password' },
    },
    async authorize(credentials) {
      const email = credentials?.email as string;
      const password = credentials?.password as string;
      if (!email || !password) return null;

      // DB에서 사용자 조회 또는 생성
      let user = await db.user.findUnique({ where: { email } });

      if (!user) {
        user = await db.user.create({
          data: {
            email,
            name: email.split('@')[0],
          },
        });
        // Organization + Membership 자동 생성
        await db.organization.create({
          data: {
            name: `${user.name}의 워크스페이스`,
            memberships: {
              create: { userId: user.id, role: 'OWNER' },
            },
          },
        });
      } else {
        // membership 없으면 생성
        const hasMembership = await db.membership.findFirst({ where: { userId: user.id } });
        if (!hasMembership) {
          await db.organization.create({
            data: {
              name: `${user.name ?? user.email}의 워크스페이스`,
              memberships: {
                create: { userId: user.id, role: 'OWNER' },
              },
            },
          });
        }
      }

      console.log('[AUTH] authorize: DB user found/created', { id: user.id, email: user.email });
      return {
        id: user.id,
        email: user.email,
        name: user.name,
      };
    },
  }),
];

if (googleClientId && googleClientSecret) {
  providers.push(
    Google({ clientId: googleClientId, clientSecret: googleClientSecret }),
  );
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers,
  adapter: PrismaAdapter(db),
  session: { strategy: 'jwt' },
  pages: { signIn: '/login' },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        console.log('[AUTH] jwt callback: user.id =', user.id);
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
  events: {
    async createUser({ user }) {
      // OAuth 신규 유저 → Organization 자동 생성
      if (user.id) {
        const hasMembership = await db.membership.findFirst({ where: { userId: user.id } });
        if (!hasMembership) {
          await db.organization.create({
            data: {
              name: `${user.name ?? user.email}의 워크스페이스`,
              memberships: {
                create: { userId: user.id, role: 'OWNER' },
              },
            },
          });
        }
      }
    },
  },
});
