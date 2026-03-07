'use client';

import { useEditorStore } from '@/stores/editor-store';

// ============================================================
// 섹션 리스트 패널 — 좌측 사이드바
// 섹션 선택, 순서 변경(위/아래 버튼), 삭제
// ============================================================

const SECTION_ICONS: Record<string, string> = {
  hero: '🎯',
  feature: '⭐',
  social_proof: '💬',
  pricing: '💰',
  cta: '🔘',
  faq: '❓',
  misc: '📎',
};

export function SectionList(): React.ReactElement {
  const sections = useEditorStore((s) => s.sections);
  const selectedOrder = useEditorStore((s) => s.selectedSectionOrder);
  const selectSection = useEditorStore((s) => s.selectSection);
  const reorderSections = useEditorStore((s) => s.reorderSections);
  const deleteSection = useEditorStore((s) => s.deleteSection);

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-gray-200 px-4 py-3">
        <h3 className="text-sm font-bold text-gray-700">섹션 ({sections.length})</h3>
      </div>

      <div className="flex-1 overflow-y-auto">
        {sections.map((section, index) => {
          const icon = SECTION_ICONS[section.sectionType] ?? '📎';
          const isSelected = selectedOrder === section.order;

          return (
            <div
              key={section.order}
              className={`group flex items-center gap-2 border-b border-gray-100 px-3 py-2.5 cursor-pointer transition-colors ${
                isSelected
                  ? 'bg-blue-50 border-l-2 border-l-blue-500'
                  : 'hover:bg-gray-50'
              }`}
              onClick={() => selectSection(section.order)}
            >
              {/* 순서 번호 */}
              <span className="flex-shrink-0 text-xs text-gray-400 w-4 text-right">
                {section.order}
              </span>

              {/* 아이콘 + 이름 */}
              <span className="text-sm">{icon}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate">
                  {section.copy.headline || section.sectionType}
                </p>
                <p className="text-xs text-gray-400 truncate">{section.patternName}</p>
              </div>

              {/* 컨트롤 버튼 (hover 시 표시) */}
              <div className="flex-shrink-0 flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                {index > 0 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      reorderSections(index, index - 1);
                    }}
                    className="p-1 text-gray-400 hover:text-gray-700 rounded"
                    title="위로"
                  >
                    ↑
                  </button>
                )}
                {index < sections.length - 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      reorderSections(index, index + 1);
                    }}
                    className="p-1 text-gray-400 hover:text-gray-700 rounded"
                    title="아래로"
                  >
                    ↓
                  </button>
                )}
                {sections.length > 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm('이 섹션을 삭제하시겠습니까?')) {
                        deleteSection(section.order);
                      }
                    }}
                    className="p-1 text-gray-400 hover:text-red-500 rounded"
                    title="삭제"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
