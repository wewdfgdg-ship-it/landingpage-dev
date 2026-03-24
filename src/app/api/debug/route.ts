import { NextResponse } from 'next/server';

export async function GET(): Promise<NextResponse> {
  const steps: Record<string, unknown> = {};

  // Step 1: auth import
  try {
    const { auth } = await import('@/lib/auth');
    steps.authImport = 'ok';

    // Step 2: auth() call
    try {
      const session = await auth();
      steps.session = session ? { id: session.user?.id, email: session.user?.email } : null;
    } catch (e) {
      steps.sessionError = e instanceof Error ? e.message : String(e);
    }
  } catch (e) {
    steps.authImportError = e instanceof Error ? e.message : String(e);
  }

  // Step 3: DB connection
  try {
    const { db } = await import('@/lib/db');
    steps.dbImport = 'ok';

    try {
      const count = await db.user.count();
      steps.userCount = count;
    } catch (e) {
      steps.dbError = e instanceof Error ? e.message : String(e);
    }
  } catch (e) {
    steps.dbImportError = e instanceof Error ? e.message : String(e);
  }

  return NextResponse.json(steps);
}
