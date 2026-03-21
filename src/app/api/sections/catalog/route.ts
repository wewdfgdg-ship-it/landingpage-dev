import { SECTION_CATALOG } from '@/engine/pipeline-manual';

// ============================================================
// 섹션 카탈로그 API
// GET /api/sections/catalog
// 수동 모드에서 선택 가능한 26개 섹션 목록 반환
// ============================================================

export function GET(): Response {
  return Response.json({
    sections: SECTION_CATALOG,
    total: SECTION_CATALOG.length,
    categories: ['필수', '제품', '신뢰', '전환', '부가'],
  });
}
