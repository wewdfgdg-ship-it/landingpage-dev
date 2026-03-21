import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET(): Promise<NextResponse> {
  const session = await auth();
  const userId = session?.user?.id ?? null;
  const email = session?.user?.email ?? null;

  let dbUser = null;
  if (userId) {
    dbUser = await db.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, isAdmin: true },
    });
  }

  return NextResponse.json({
    session: { userId, email, hasSession: !!session },
    dbUser,
  });
}
