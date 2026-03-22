// ============================================================
// Chromakey Processing — 녹색 배경 제거 (sharp 기반)
// 입력: 녹색(#00FF00) 배경 이미지 → 출력: 투명 배경 PNG
// ============================================================

import sharp from 'sharp';

interface ChromakeyResult {
  imageData: Buffer;
  mimeType: string;
}

/** 녹색 채널 우세 + 밝기 기준으로 크로마키 마스크 생성 */
function buildAlphaMask(
  rawPixels: Buffer,
  width: number,
  height: number,
): Buffer {
  // 허용 범위: 녹색이 빨강/파랑보다 충분히 높으면 투명 처리
  const GREEN_DOMINANCE = 40; // G가 R, B보다 이만큼 이상 높아야 녹색으로 판정
  const GREEN_MIN = 100; // G 채널 최소값
  const EDGE_FEATHER = 15; // 경계 부드럽게 (anti-alias)

  const alpha = Buffer.alloc(width * height);

  for (let i = 0; i < width * height; i++) {
    const offset = i * 3; // RGB (3채널)
    const r = rawPixels[offset];
    const g = rawPixels[offset + 1];
    const b = rawPixels[offset + 2];

    const isGreen =
      g >= GREEN_MIN &&
      g - r >= GREEN_DOMINANCE &&
      g - b >= GREEN_DOMINANCE;

    if (isGreen) {
      // 완전 녹색 → 완전 투명
      alpha[i] = 0;
    } else {
      // 경계 부근: 녹색에 가까울수록 반투명
      const greenness = Math.max(0, g - Math.max(r, b));
      if (greenness > EDGE_FEATHER) {
        // 약간 녹색 끼 있음 → 부분 투명
        const ratio = Math.min(1, greenness / (GREEN_DOMINANCE + EDGE_FEATHER));
        alpha[i] = Math.round(255 * (1 - ratio));
      } else {
        // 녹색 아님 → 완전 불투명
        alpha[i] = 255;
      }
    }
  }

  return alpha;
}

/** 크로마키(녹색 배경) 제거 → 투명 PNG 변환 */
export async function processChromakey(
  imageData: Buffer,
  _mimeType: string,
): Promise<ChromakeyResult> {
  // 1. 이미지 메타데이터 추출
  const image = sharp(imageData);
  const metadata = await image.metadata();
  const width = metadata.width ?? 0;
  const height = metadata.height ?? 0;

  if (width === 0 || height === 0) {
    return { imageData, mimeType: 'image/png' };
  }

  // 2. Raw RGB 픽셀 추출
  const rawRgb = await sharp(imageData)
    .removeAlpha()
    .raw()
    .toBuffer();

  // 3. 알파 마스크 생성
  const alphaMask = buildAlphaMask(rawRgb, width, height);

  // 4. RGBA 합성: RGB + Alpha
  const rawRgba = Buffer.alloc(width * height * 4);
  for (let i = 0; i < width * height; i++) {
    rawRgba[i * 4] = rawRgb[i * 3]; // R
    rawRgba[i * 4 + 1] = rawRgb[i * 3 + 1]; // G
    rawRgba[i * 4 + 2] = rawRgb[i * 3 + 2]; // B
    rawRgba[i * 4 + 3] = alphaMask[i]; // A
  }

  // 5. PNG로 변환 (투명도 유지)
  const pngBuffer = await sharp(rawRgba, {
    raw: { width, height, channels: 4 },
  })
    .png({ compressionLevel: 9 })
    .toBuffer();

  return {
    imageData: pngBuffer,
    mimeType: 'image/png',
  };
}
