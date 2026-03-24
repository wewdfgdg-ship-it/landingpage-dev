import NextAuth from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { db } from '@/lib/db';
import { authConfig } from '@/lib/auth.config';

// ============================================================
// 서버 전용 인증 설정 (API routes, Server Components용)
// PrismaAdapter 포함 — Node.js Runtime 전용
// ============================================================

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(db),
  callbacks: {
    async signIn({ user, account }) {
      // Credentials 로그인 시 DB에 User + Org 자동 생성
      if (account?.provider === 'credentials' && user.email) {
        const existing = await db.user.findUnique({ where: { email: user.email } });
        if (!existing) {
          const created = await db.user.create({
            data: {
              email: user.email,
              name: user.name ?? user.email.split('@')[0],
            },
          });
          await db.organization.create({
            data: {
              name: `${created.name}의 워크스페이스`,
              memberships: {
                create: { userId: created.id, role: 'OWNER' },
              },
            },
          });
          user.id = created.id;
        } else {
          user.id = existing.id;
          const hasMembership = await db.membership.findFirst({ where: { userId: existing.id } });
          if (!hasMembership) {
            await db.organization.create({
              data: {
                name: `${existing.name ?? existing.email}의 워크스페이스`,
                memberships: {
                  create: { userId: existing.id, role: 'OWNER' },
                },
              },
            });
          }
        }
      }
      return true;
    },
    async jwt({ token, user, account }) {
      if (user) {
        // Credentials 로그인: authorize()의 가짜 ID 대신 DB의 실제 ID 사용
        if (account?.provider === 'credentials' && user.email) {
          const dbUser = await db.user.findUnique({
            where: { email: user.email },
            select: { id: true },
          });
          token.id = dbUser?.id ?? user.id;
        } else {
          token.id = user.id;
        }
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
