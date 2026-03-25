'use client';

import { useState, useRef } from 'react';
import { useEditorStore } from '@/stores/editor-store';

// ============================================================
// 섹션 리스트 패널 — 좌측 사이드바
// 섹션 선택, 드래그앤드롭 정렬, 추가/삭제/복제
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

const SECTION_TYPES: { type: string; label: string }[] = [
  { type: 'hero', label: '히어로' },
  { type: 'feature', label: '기능 소개' },
  { type: 'social_proof', label: '사회적 증거' },
  { type: 'pricing', label: '가격' },
  { type: 'cta', label: 'CTA' },
  { type: 'faq', label: 'FAQ' },
  { type: 'misc', label: '기타' },
];

export function SectionList(): React.ReactElement {
  const sections = useEditorStore((s) => s.sections);
  const selectedOrder = useEditorStore((s) => s.selectedSectionOrder);
  const selectSection = useEditorStore((s) => s.selectSection);
  const moveSection = useEditorStore((s) => s.moveSection);
  const deleteSection = useEditorStore((s) => s.deleteSection);
  const addSection = useEditorStore((s) => s.addSection);
  const duplicateSection = useEditorStore((s) => s.duplicateSection);

  const [showAddMenu, setShowAddMenu] = useState(false);
  const [dragOverOrder, setDragOverOrder] = useState<number | null>(null);
  const dragSrcOrderRef = useRef<number | null>(null);

  // ── 드래그앤드롭 핸들러 ──────────────────────────────────
  const handleDragStart = (order: number): void => {
    dragSrcOrderRef.current = order;
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, order: number): void => {
    e.preventDefault();
    if (dragSrcOrderRef.current !== order) {
      setDragOverOrder(order);
    }
  };

  const handleDragLeave = (): void => {
    setDragOverOrder(null);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, toOrder: number): void => {
    e.preventDefault();
    setDragOverOrder(null);
    const fromOrder = dragSrcOrderRef.current;
    if (fromOrder !== null && fromOrder !== toOrder) {
      moveSection(fromOrder, toOrder);
    }
    dragSrcOrderRef.current = null;
  };

  const handleDragEnd = (): void => {
    dragSrcOrderRef.current = null;
    setDragOverOrder(null);
  };

  return (
    <div className="flex h-full flex-col">
      {/* 헤더 */}
      <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
        <h3 className="text-sm font-bold text-gray-700">섹션 ({sections.length})</h3>
        <div className="relative">
          <button
            onClick={() => setShowAddMenu((v) => !v)}
            className="flex items-center gap-1 rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-600 hover:bg-blue-100 transition-colors"
            title="섹션 추가"
          >
            <span className="text-base leading-none">+</span>
            <span>추가</span>
          </button>

          {/* 섹션 타입 선택 메뉴 */}
          {showAddMenu && (
            <div className="absolute left-0 top-full z-10 mt-1 w-36 rounded-lg border border-gray-200 bg-white shadow-lg">
              <p className="border-b border-gray-100 px-3 py-1.5 text-xs font-medium text-gray-500">
                섹션 유형 선택
              </p>
              {SECTION_TYPES.map(({ type, label }) => (
                <button
                  key={type}
                  onClick={() => {
                    addSection(type);
                    setShowAddMenu(false);
                  }}
                  className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-xs text-gray-700 hover:bg-gray-50"
                >
                  <span>{SECTION_ICONS[type] ?? '📎'}</span>
                  <span>{label}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 섹션 목록 */}
      <div
        className="flex-1 overflow-y-auto"
        onClick={() => setShowAddMenu(false)}
      >
        {sections.map((section) => {
          const icon = SECTION_ICONS[section.sectionType] ?? '📎';
          const isSelected = selectedOrder === section.order;
          const isDragOver = dragOverOrder === section.order;

          return (
            <div
              key={section.order}
              draggable
              onDragStart={() => handleDragStart(section.order)}
              onDragOver={(e) => handleDragOver(e, section.order)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, section.order)}
              onDragEnd={handleDragEnd}
              className={[
                'group flex items-center gap-2 border-b px-3 py-2.5 cursor-pointer transition-colors select-none',
                isSelected
                  ? 'bg-blue-50 border-l-2 border-l-blue-500 border-b-gray-100'
                  : 'border-b-gray-100 hover:bg-gray-50',
                isDragOver
                  ? 'border-t-2 border-t-blue-400 bg-blue-50/50'
                  : '',
              ]
                .filter(Boolean)
                .join(' ')}
              onClick={() => selectSection(section.order)}
            >
              {/* 드래그 핸들 */}
              <span
                className="flex-shrink-0 cursor-grab text-gray-300 hover:text-gray-500 active:cursor-grabbing"
                title="드래그하여 순서 변경"
              >
                ⠿
              </span>

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
                {/* 위로 이동 */}
                {section.order > 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      moveSection(section.order, section.order - 1);
                    }}
                    className="rounded p-1 text-gray-400 hover:text-blue-500 text-xs"
                    title="위로 이동"
                  >
                    ▲
                  </button>
                )}

                {/* 아래로 이동 */}
                {section.order < sections.length && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      moveSection(section.order, section.order + 1);
                    }}
                    className="rounded p-1 text-gray-400 hover:text-blue-500 text-xs"
                    title="아래로 이동"
                  >
                    ▼
                  </button>
                )}

                {/* 복제 */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    duplicateSection(section.order);
                  }}
                  className="rounded p-1 text-gray-400 hover:text-blue-500"
                  title="복제"
                >
                  ⎘
                </button>

                {/* 삭제 */}
                {sections.length > 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm('이 섹션을 삭제하시겠습니까?')) {
                        deleteSection(section.order);
                      }
                    }}
                    className="rounded p-1 text-gray-400 hover:text-red-500"
                    title="삭제"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {/* 목록 하단 추가 버튼 */}
        <button
          onClick={() => setShowAddMenu((v) => !v)}
          className="flex w-full items-center justify-center gap-1.5 py-3 text-xs text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors"
        >
          <span className="text-base leading-none">+</span>
          <span>섹션 추가</span>
        </button>
      </div>
    </div>
  );
}
