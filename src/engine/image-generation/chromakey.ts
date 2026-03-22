// ============================================================
// Chromakey Processing — 녹색 배경 제거
// TODO: sharp 패키지 설치 후 실제 크로마키 처리 구현
// ============================================================

interface ChromakeyResult {
  imageData: Buffer;
  mimeType: string;
}

/** 크로마키(녹색 배경) 제거 처리 — 현재 패스스루 */
export async function processChromakey(
  imageData: Buffer,
  mimeType: string,
): Promise<ChromakeyResult> {
  // TODO: sharp 패키지 설치 후 구현
  // 1. 녹색(#00FF00) 픽셀 감지
  // 2. 알파 채널로 변환 (투명 처리)
  // 3. PNG로 출력 (투명도 지원)
  return { imageData, mimeType };
}
