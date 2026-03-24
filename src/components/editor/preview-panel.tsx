'use client';

import { useState } from 'react';
import { useEditorStore } from '@/stores/editor-store';
import { cn } from '@/lib/utils';

// ============================================================
// 미리보기 패널 — 중앙
// iframe으로 실시간 미리보기, 데스크톱/모바일 전환
// ============================================================

export function PreviewPanel(): React.ReactElement {
  const previewHtml = useEditorStore((s) => s.previewHtml);
  const isRebuilding = useEditorStore((s) => s.isRebuilding);
  const isLiveUpdating = useEditorStore((s) => s.isLiveUpdating);
  const [device, setDevice] = useState<'desktop' | 'mobile'>('desktop');

  return (
    <div className="flex h-full flex-col bg-gray-100">
      {/* 툴바 */}
      <div className="flex items-center justify-between border-b border-gray-200 bg-white px-4 py-2">
        <div className="flex gap-1.5">
          <button
            onClick={() => setDevice('desktop')}
            className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
              device === 'desktop'
                ? 'bg-gray-900 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            데스크톱
          </button>
          <button
            onClick={() => setDevice('mobile')}
            className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
              device === 'mobile'
                ? 'bg-gray-900 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            모바일
          </button>
        </div>

        {isLiveUpdating && !isRebuilding && (
          <span className="text-xs text-gray-400 animate-pulse">실시간 반영 중...</span>
        )}
        {isRebuilding && (
          <span className="text-xs text-blue-600 animate-pulse">미리보기 갱신 중...</span>
        )}
      </div>

      {/* iframe 미리보기 */}
      <div className="flex-1 flex justify-center overflow-auto p-4">
        <div
          className={cn(
            'bg-white shadow-lg rounded-lg overflow-hidden transition-all max-w-full',
            device === 'mobile' ? 'w-[375px]' : 'w-full',
          )}
        >
          <iframe
            srcDoc={previewHtml}
            className="w-full h-full min-h-[600px]"
            title="페이지 미리보기"
            sandbox="allow-scripts"
          />
        </div>
      </div>
    </div>
  );
}
