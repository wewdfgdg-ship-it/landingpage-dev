'use client';

import { useEditorStore } from '@/stores/editor-store';
import type { CopyBlock } from '@/engine/05-psychological-copy/types';

// ============================================================
// 편집 패널 — 우측 사이드바
// 선택된 섹션의 카피 수정 + 레이아웃 패턴 변경
// ============================================================

/** 카테고리별 패턴 목록 */
const PATTERN_OPTIONS: Record<string, { id: string; name: string }[]> = {
  hero: [
    { id: 'hero_fullscreen_center', name: '풀스크린 센터' },
    { id: 'hero_left_right', name: '좌카피 + 우이미지' },
    { id: 'hero_gradient', name: '그라디언트' },
    { id: 'hero_split', name: '스플릿' },
    { id: 'hero_product_center', name: '제품 중심' },
    { id: 'hero_minimal_typo', name: '미니멀 타이포' },
    { id: 'hero_card', name: '카드형' },
  ],
  feature: [
    { id: 'feat_3col_grid', name: '3컬럼 그리드' },
    { id: 'feat_zigzag', name: '지그재그' },
    { id: 'feat_icon_list', name: '아이콘 리스트' },
    { id: 'feat_numbered_steps', name: '번호 스텝' },
    { id: 'feat_card_grid', name: '카드 그리드' },
    { id: 'feat_accordion', name: '아코디언' },
    { id: 'feat_comparison', name: '비교표' },
  ],
  social_proof: [
    { id: 'proof_testimonial_card', name: '테스티모니얼 카드' },
    { id: 'proof_review_carousel', name: '리뷰 캐러셀' },
    { id: 'proof_number_counter', name: '숫자 카운터' },
    { id: 'proof_logo_bar', name: '로고 바' },
    { id: 'proof_rating_text', name: '별점 + 텍스트' },
  ],
  pricing: [
    { id: 'price_3col_compare', name: '3컬럼 비교' },
    { id: 'price_single_card', name: '단일 카드' },
    { id: 'price_toggle', name: '월간/연간 토글' },
  ],
  cta: [
    { id: 'cta_center', name: '센터 정렬' },
    { id: 'cta_full_banner', name: '풀폭 배너' },
    { id: 'cta_left_right', name: '좌카피 + 우버튼' },
  ],
  faq: [
    { id: 'faq_accordion', name: '아코디언' },
    { id: 'faq_2col', name: '2컬럼 Q&A' },
  ],
  misc: [
    { id: 'misc_before_after', name: 'Before/After' },
    { id: 'misc_timeline', name: '타임라인' },
    { id: 'misc_process_flow', name: '프로세스 플로우' },
    { id: 'misc_footer', name: '푸터' },
  ],
};

function FieldInput({
  label,
  value,
  onChange,
  multiline,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  multiline?: boolean;
}): React.ReactElement {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-500 mb-1">{label}</label>
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={3}
          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400 resize-none"
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
        />
      )}
    </div>
  );
}

function BulletEditor({
  items,
  onChange,
}: {
  items: string[];
  onChange: (items: string[]) => void;
}): React.ReactElement {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-500 mb-1">
        불릿 포인트 ({items.length})
      </label>
      <div className="space-y-1.5">
        {items.map((item, i) => (
          <div key={i} className="flex gap-1.5">
            <input
              type="text"
              value={item}
              onChange={(e) => {
                const newItems = [...items];
                newItems[i] = e.target.value;
                onChange(newItems);
              }}
              className="flex-1 rounded-lg border border-gray-200 px-2.5 py-1.5 text-sm focus:border-blue-400 focus:outline-none"
            />
            <button
              onClick={() => onChange(items.filter((_, j) => j !== i))}
              className="px-2 text-gray-400 hover:text-red-500 text-sm"
            >
              ✕
            </button>
          </div>
        ))}
        <button
          onClick={() => onChange([...items, ''])}
          className="w-full rounded-lg border border-dashed border-gray-300 py-1.5 text-xs text-gray-400 hover:border-gray-400 hover:text-gray-600"
        >
          + 항목 추가
        </button>
      </div>
    </div>
  );
}

export function EditPanel(): React.ReactElement {
  const sections = useEditorStore((s) => s.sections);
  const selectedOrder = useEditorStore((s) => s.selectedSectionOrder);
  const updateCopy = useEditorStore((s) => s.updateCopy);
  const changePattern = useEditorStore((s) => s.changePattern);

  const section = sections.find((s) => s.order === selectedOrder);

  if (!section) {
    return (
      <div className="flex h-full items-center justify-center p-6">
        <div className="text-center">
          <p className="text-sm text-gray-400">좌측에서 섹션을 선택하세요</p>
        </div>
      </div>
    );
  }

  const patterns = PATTERN_OPTIONS[section.sectionType] ?? [];
  const copyFields: { key: keyof CopyBlock; label: string; multiline?: boolean }[] = [
    { key: 'headline', label: '헤드라인' },
    { key: 'subheadline', label: '서브 헤드라인' },
    { key: 'body', label: '본문', multiline: true },
    { key: 'ctaText', label: 'CTA 버튼 텍스트' },
    { key: 'microCopy', label: '마이크로 카피' },
  ];

  return (
    <div className="flex h-full flex-col">
      {/* 헤더 */}
      <div className="border-b border-gray-200 px-4 py-3">
        <h3 className="text-sm font-bold text-gray-700">
          섹션 {section.order} 편집
        </h3>
        <p className="text-xs text-gray-400 mt-0.5">{section.sectionType}</p>
      </div>

      {/* 편집 폼 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* 레이아웃 패턴 선택 */}
        {patterns.length > 0 && (
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              레이아웃 패턴
            </label>
            <select
              value={section.patternId}
              onChange={(e) => {
                const p = patterns.find((p) => p.id === e.target.value);
                if (p) changePattern(section.order, p.id, p.name);
              }}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-400 focus:outline-none"
            >
              {patterns.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* 카피 필드 */}
        {copyFields.map(({ key, label, multiline }) => {
          const value = section.copy[key];
          if (typeof value !== 'string') return null;
          return (
            <FieldInput
              key={key}
              label={label}
              value={value}
              onChange={(v) => updateCopy(section.order, key, v)}
              multiline={multiline}
            />
          );
        })}

        {/* 불릿 포인트 */}
        <BulletEditor
          items={section.copy.bulletPoints}
          onChange={(items) => updateCopy(section.order, 'bulletPoints', items)}
        />

        {/* 이미지 지시문 */}
        <FieldInput
          label="이미지 지시문"
          value={section.copy.imageDirection}
          onChange={(v) => updateCopy(section.order, 'imageDirection', v)}
          multiline
        />
      </div>
    </div>
  );
}
