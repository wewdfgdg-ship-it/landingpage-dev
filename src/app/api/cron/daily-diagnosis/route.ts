import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { runLearningLoop } from '@/engine/12-learning-loop';

// ============================================================
// 일일 진단 크론 — Vercel Cron 또는 외부 스케줄러에서 호출
// GET /api/cron/daily-diagnosis
// Authorization: Bearer CRON_SECRET
// ============================================================

export async function GET(req: Request): Promise<NextResponse> {
  // 크론 시크릿 검증 — Vercel Cron 또는 외부 스케줄러
  const isVercelCron = req.headers.get('x-vercel-cron-signature') !== null;
  const authHeader = req.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;

  if (!isVercelCron && cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // 배포된 프로젝트 조회
  const deployedProjects = await db.project.findMany({
    where: { isDeployed: true, deletedAt: null },
    select: { id: true, name: true },
  });

  const results = [];

  for (const project of deployedProjects) {
    try {
      const output = await runLearningLoop(project.id);
      results.push({
        projectId: project.id,
        projectName: project.name,
        diagnoses: output.diagnoses.length,
        prescriptions: output.prescriptions.length,
        activeTests: output.activeTests.length,
      });
    } catch (error) {
      results.push({
        projectId: project.id,
        projectName: project.name,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  return NextResponse.json({
    processedAt: new Date().toISOString(),
    totalProjects: deployedProjects.length,
    results,
  });
}
