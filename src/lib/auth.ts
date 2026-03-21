import NextAuth from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { db } from '@/lib/db';
import { authConfig } from '@/lib/auth.config';
import { sendWelcome } from '@/lib/email';

// ============================================================
// 서버 전용 인증 설정 (API routes, Server Components용)
// PrismaAdapter 포함 — Node.js Runtime 전용
// ============================================================

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(db),
  events: {
    async createUser({ user }) {
      // 신규 유저 → Organization 자동 생성
      if (user.id) {
        await db.organization.create({
          data: {
            name: `${user.name ?? user.email}의 워크스페이스`,
            memberships: {
              create: {
                userId: user.id,
                role: 'OWNER',
              },
            },
          },
        });

        // 환영 이메일 (비동기, 실패해도 무시)
        if (user.email) {
          sendWelcome(user.email, user.name ?? '사용자').catch(() => {});
        }
      }
    },
  },
});
