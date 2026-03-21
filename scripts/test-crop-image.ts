/**
 * 단일 이미지 파일에서 섹션 크롭 테스트
 * 실행: npx tsx scripts/test-crop-image.ts [image-path]
 */

import 'dotenv/config';
import fs from 'fs';
import path from 'path';

async function main(): Promise<void> {
  const imagePath = process.argv[2] || path.join(process.cwd(), 'test-output', 'download.png');
  const outputDir = path.dirname(imagePath);

  if (!fs.existsSync(imagePath)) {
    process.stderr.write(`파일 없음: ${imagePath}\n`);
    process.exit(1);
  }

  process.stdout.write(`🔧 이미지 크롭 테스트\n파일: ${imagePath}\n\n`);

  const imageBuffer = fs.readFileSync(imagePath);

  // Sharp로 JPEG 변환 (PNG → JPEG)
  const sharp = await import('sharp').then((m) => m.default);
  const metadata = await sharp(imageBuffer).metadata();
  process.stdout.write(`   크기: ${metadata.width}x${metadata.height} (${metadata.format})\n`);

  const jpegBuffer = await sharp(imageBuffer).jpeg({ quality: 90 }).toBuffer();

  // 크롭 함수 직접 호출 (page 없이 AI 폴백 경로)
  const { detectAndCaptureSections } = await import('../src/engine/crawler/crop');

  // page가 없으므로 null 전달 → AI 폴백 사용
  const sections = await detectAndCaptureSections(null as never, jpegBuffer);

  process.stdout.write(`\n✅ ${sections.length}개 섹션 발견\n\n`);

  // 기존 crop 결과 정리
  for (const f of fs.readdirSync(outputDir)) {
    if (f.startsWith('crop-')) fs.unlinkSync(path.join(outputDir, f));
  }

  for (let i = 0; i < sections.length; i++) {
    const c = sections[i];
    const fileName = `crop-${i}-${c.sectionType}.jpg`;
    fs.writeFileSync(path.join(outputDir, fileName), c.imageBuffer);
    process.stdout.write(`   → ${c.sectionType} (${Math.round(c.confidence * 100)}%) ${c.width}x${c.height} — ${Math.round(c.imageBuffer.length / 1024)}KB\n`);
  }

  process.stdout.write(`\n🏁 완료 — ${outputDir}\n`);
}

main().catch((e) => {
  process.stderr.write(`${e}\n`);
  process.exit(1);
});
