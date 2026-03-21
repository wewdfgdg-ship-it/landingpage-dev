'use client';

import { useCallback, useRef } from 'react';
import { useEditorStore } from '@/stores/editor-store';

// ============================================================
// 섹션 리스트 패널 — 좌측 사이드바
// HTML5 드래그 정렬, 섹션 선택, 삭제
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
  const dragIndex = useEditorStore((s) => s.dragIndex);
  const dragOverIndex = useEditorStore((s) => s.dragOverIndex);
  const setDragIndex = useEditorStore((s) => s.setDragIndex);
  const setDragOverIndex = useEditorStore((s) => s.setDragOverIndex);

  const dragCounterRef = useRef(0);

  const handleDragStart = useCallback(
    (e: React.DragEvent<HTMLDivElement>, index: number): void => {
      setDragIndex(index);
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', String(index));
      // 드래그 시작 시 살짝 투명하게
      const target = e.currentTarget;
      requestAnimationFrame(() => {
        target.style.opacity = '0.4';
      });
    },
    [setDragIndex],
  );

  const handleDragEnd = useCallback(
    (e: React.DragEvent<HTMLDivElement>): void => {
      e.currentTarget.style.opacity = '1';
      setDragIndex(null);
      setDragOverIndex(null);
      dragCounterRef.current = 0;
    },
    [setDragIndex, setDragOverIndex],
  );

  const handleDragOver = useCallback(
    (e: React.DragEvent<HTMLDivElement>, index: number): void => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      if (dragIndex !== null && dragIndex !== index) {
        setDragOverIndex(index);
      }
    },
    [dragIndex, setDragOverIndex],
  );

  const handleDragEnter = useCallback(
    (e: React.DragEvent<HTMLDivElement>): void => {
      e.preventDefault();
      dragCounterRef.current += 1;
    },
    [],
  );

  const handleDragLeave = useCallback((): void => {
    dragCounterRef.current -= 1;
    if (dragCounterRef.current === 0) {
      setDragOverIndex(null);
    }
  }, [setDragOverIndex]);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>, toIndex: number): void => {
      e.preventDefault();
      const fromIndex = dragIndex;
      if (fromIndex !== null && fromIndex !== toIndex) {
        reorderSections(fromIndex, toIndex);
      }
      setDragIndex(null);
      setDragOverIndex(null);
      dragCounterRef.current = 0;
    },
    [dragIndex, reorderSections, setDragIndex, setDragOverIndex],
  );

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-gray-200 px-4 py-3">
        <h3 className="text-sm font-bold text-gray-700">섹션 ({sections.length})</h3>
        <p className="text-xs text-gray-400 mt-0.5">드래그하여 순서 변경</p>
      </div>

      <div className="flex-1 overflow-y-auto">
        {sections.map((section, index) => {
          const icon = SECTION_ICONS[section.sectionType] ?? '📎';
          const isSelected = selectedOrder === section.order;
          const isDragging = dragIndex === index;
          const isDragOver = dragOverIndex === index && dragIndex !== index;

          return (
            <div
              key={`section-${section.order}-${section.sectionType}`}
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragEnd={handleDragEnd}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, index)}
              className={[
                'group flex items-center gap-2 border-b border-gray-100 px-3 py-2.5 cursor-grab transition-all',
                isSelected ? 'bg-blue-50 border-l-2 border-l-blue-500' : 'hover:bg-gray-50',
                isDragging ? 'opacity-40' : '',
                isDragOver ? 'border-t-2 border-t-blue-400 bg-blue-50/30' : '',
              ].join(' ')}
              onClick={() => selectSection(section.order)}
            >
              {/* 드래그 핸들 */}
              <span className="flex-shrink-0 text-gray-300 cursor-grab select-none text-xs">
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
