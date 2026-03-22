import { PrismaClient } from '../src/generated/prisma/client.js';
import { PrismaPg } from '@prisma/adapter-pg';
import { runCodeEngine } from '../src/engine/10-code-engine/index.js';
import type { CopyBlocks } from '../src/engine/05-psychological-copy/types.js';
import type { LayoutConfig } from '../src/engine/08-layout-intelligence/types.js';
import type { StyleConfig } from '../src/engine/09-visual-style/types.js';
import * as fs from 'node:fs';

async function main(): Promise<void> {
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
  const prisma = new PrismaClient({ adapter });

  const project = await prisma.project.findFirst({
    where: { status: 'GENERATED' },
    select: {
      id: true,
      name: true,
      copyBlocks: true,
      layoutConfig: true,
      styleConfig: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  if (!project || !project.copyBlocks || !project.layoutConfig || !project.styleConfig) {
    fs.writeFileSync('db-test.txt', 'NO DATA\n');
    process.exit(1);
  }

  fs.writeFileSync('db-test.txt', `RE-RENDERING: ${project.name}\n`);

  // 카피 데이터 캐스팅
  const copyBlocks = project.copyBlocks as unknown as CopyBlocks;

  // 테스트용 무료 이미지 주입 (Unsplash — 매트리스/침실/수면 테마)
  const IMG: Record<number, string> = {
    1: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=900&q=80', // 모던 침실
    4: 'https://images.unsplash.com/photo-1616627561950-9f746e330187?w=800&q=80', // 베개/침구
  };

  for (const section of copyBlocks.sections) {
    const url = IMG[section.sectionOrder];
    if (url) {
      section.copy.imageUrl = url;
    }
  }

  // Before/After 섹션 카피 보정 (테스트용 — 매트리스 제품에 맞는 대구 구조)
  const baSection = copyBlocks.sections.find((s) => s.sectionOrder === 3);
  if (baSection) {
    baSection.copy.headline = '이 매트리스 하나로 달라진 아침';
    baSection.copy.subheadline = '같은 시간을 자도, 잠의 질이 다릅니다';
    baSection.copy.bulletPoints = [
      // Before (전반부)
      '새벽 2시마다 뒤척임 → 만성 수면 부족',
      '아침마다 허리 통증 → 하루 종일 컨디션 저하',
      // After (후반부)
      '7시간 숙면 → 알람 없이 개운하게 기상',
      '체형 맞춤 지지 → 허리 통증 없는 가벼운 아침',
    ];
  }

  // 기존 데이터를 v2 엔진으로 재렌더링
  const result = runCodeEngine(
    project.name,
    copyBlocks,
    project.layoutConfig as unknown as LayoutConfig,
    project.styleConfig as unknown as StyleConfig,
    false,
    project.id,
  );

  fs.appendFileSync('db-test.txt', `SECTIONS: ${result.totalSections}\n`);
  fs.appendFileSync('db-test.txt', `HTML_LENGTH: ${result.fullHtml.length}\n`);
  fs.writeFileSync('test-v2.html', result.fullHtml);
  fs.appendFileSync('db-test.txt', 'SAVED: test-v2.html\n');

  // 섹션 정보
  for (const s of result.sections) {
    fs.appendFileSync('db-test.txt', `  ${s.order}. [${s.patternId}] ${s.sectionType}\n`);
  }

  process.exit(0);
}

main().catch((e: Error) => {
  fs.appendFileSync('db-test.txt', `ERR: ${e.message}\n`);
  process.exit(1);
});
