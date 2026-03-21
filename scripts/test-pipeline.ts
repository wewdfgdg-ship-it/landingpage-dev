/**
 * 크롤러 파이프라인 통합 테스트 — DOM 우선 + AI 폴백
 * 실행: npx tsx scripts/test-pipeline.ts [url]
 */

import 'dotenv/config';
import fs from 'fs';
import path from 'path';

async function main(): Promise<void> {
  const testUrl = process.argv[2] || 'https://www.apple.com/kr/iphone/';
  const outputDir = path.join(process.cwd(), 'test-output');

  process.stdout.write(`🔧 크롤러 테스트 (DOM 우선 + AI 폴백)\n대상: ${testUrl}\n\n`);

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const siteName = new URL(testUrl).hostname.replace('www.', '').split('.')[0];
  for (const f of fs.readdirSync(outputDir)) {
    if (f.startsWith(siteName)) fs.unlinkSync(path.join(outputDir, f));
  }

  // === 1단계: 페이지 방문 + fullPage 스크린샷 ===
  process.stdout.write('=== 1단계: 페이지 방문 ===\n');
  const { takeScreenshotKeepOpen, closeBrowser } = await import('../src/engine/crawler/screenshot');
  const live = await takeScreenshotKeepOpen(testUrl);
  process.stdout.write(`✅ "${live.pageTitle}" — ${live.pageHeight}px\n`);

  const fullPath = path.join(outputDir, `${siteName}-fullpage.jpg`);
  fs.writeFileSync(fullPath, live.screenshotBuffer);
  process.stdout.write(`   fullPage: ${Math.round(live.screenshotBuffer.length / 1024)}KB\n\n`);

  // === 2단계: 섹션 감지 + 크롭 ===
  process.stdout.write('=== 2단계: 섹션 감지 (DOM 우선 → AI 폴백) ===\n');
  const { detectAndCaptureSections } = await import('../src/engine/crawler/crop');
  const sections = await detectAndCaptureSections(live.page, live.screenshotBuffer);

  process.stdout.write(`✅ ${sections.length}개 유효 섹션\n\n`);

  for (let i = 0; i < sections.length; i++) {
    const c = sections[i];
    const fileName = `${siteName}-${i}-${c.sectionType}.jpg`;
    fs.writeFileSync(path.join(outputDir, fileName), c.imageBuffer);
    process.stdout.write(`   → ${c.sectionType} (${Math.round(c.confidence * 100)}%) ${c.width}x${c.height} — ${Math.round(c.imageBuffer.length / 1024)}KB\n`);
  }

  await live.context.close();
  await closeBrowser();
  process.stdout.write(`\n🏁 완료 — ${outputDir}\n`);
}

main().catch((e) => {
  process.stderr.write(`${e}\n`);
  process.exit(1);
});
