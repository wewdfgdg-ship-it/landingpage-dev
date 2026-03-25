'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useEditorStore } from '@/stores/editor-store';
import { cn } from '@/lib/utils';

// ============================================================
// 미리보기 패널 — 중앙
// iframe으로 실시간 미리보기, 데스크톱/모바일 전환
// 양방향 연동: 섹션 선택 시 스크롤, iframe 클릭 시 섹션 선택
// ============================================================

/** iframe에 주입할 양방향 연동 스크립트 */
function buildBridgeScript(): string {
  return `
<script>
(function() {
  // 섹션 클릭 시 부모에 메시지 전달
  document.addEventListener('click', function(e) {
    var el = e.target;
    while (el && el !== document.body) {
      var zone = el.getAttribute('data-zone');
      if (zone) {
        var match = zone.match(/section_(\\d+)/);
        if (match) {
          window.parent.postMessage({ type: 'section-click', order: parseInt(match[1], 10) }, '*');
          return;
        }
      }
      el = el.parentElement;
    }
  });

  // 부모에서 스크롤 요청 수신
  window.addEventListener('message', function(e) {
    if (e.data && e.data.type === 'scroll-to-section') {
      var sections = document.querySelectorAll('[data-zone]');
      for (var i = 0; i < sections.length; i++) {
        var zone = sections[i].getAttribute('data-zone');
        if (zone && zone.indexOf('section_' + e.data.order + '_') === 0) {
          sections[i].scrollIntoView({ behavior: 'smooth', block: 'start' });
          // 하이라이트 효과
          sections[i].style.transition = 'outline 0.3s, outline-offset 0.3s';
          sections[i].style.outline = '3px solid #3b82f6';
          sections[i].style.outlineOffset = '-3px';
          setTimeout(function() {
            sections[i].style.outline = 'none';
          }, 1500);
          return;
        }
      }
    }
  });

  // 마우스 오버 시 섹션 하이라이트
  var lastHover = null;
  document.addEventListener('mouseover', function(e) {
    var el = e.target;
    while (el && el !== document.body) {
      var zone = el.getAttribute('data-zone');
      if (zone) {
        if (lastHover && lastHover !== el) {
          lastHover.style.outline = 'none';
        }
        el.style.outline = '2px dashed #93c5fd';
        el.style.outlineOffset = '-2px';
        el.style.cursor = 'pointer';
        lastHover = el;
        return;
      }
      el = el.parentElement;
    }
  });
  document.addEventListener('mouseout', function(e) {
    if (lastHover) {
      lastHover.style.outline = 'none';
      lastHover = null;
    }
  });
})();
</script>`;
}

/** previewHtml에 브릿지 스크립트 주입 */
function injectBridgeScript(html: string): string {
  if (!html) return html;
  const closeBody = html.lastIndexOf('</body>');
  if (closeBody !== -1) {
    return html.slice(0, closeBody) + buildBridgeScript() + html.slice(closeBody);
  }
  return html + buildBridgeScript();
}

export function PreviewPanel(): React.ReactElement {
  const previewHtml = useEditorStore((s) => s.previewHtml);
  const isRebuilding = useEditorStore((s) => s.isRebuilding);
  const isLiveUpdating = useEditorStore((s) => s.isLiveUpdating);
  const selectedOrder = useEditorStore((s) => s.selectedSectionOrder);
  const selectSection = useEditorStore((s) => s.selectSection);
  const [device, setDevice] = useState<'desktop' | 'mobile'>('desktop');
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // iframe 메시지 수신: 섹션 클릭 → 에디터 선택
  useEffect(() => {
    const handleMessage = (e: MessageEvent): void => {
      if (e.data?.type === 'section-click' && typeof e.data.order === 'number') {
        selectSection(e.data.order);
      }
    };
    window.addEventListener('message', handleMessage);
    return (): void => { window.removeEventListener('message', handleMessage); };
  }, [selectSection]);

  // 섹션 선택 시 iframe 내 스크롤 동기화
  const scrollToSection = useCallback((order: number | null): void => {
    if (order === null || !iframeRef.current?.contentWindow) return;
    iframeRef.current.contentWindow.postMessage(
      { type: 'scroll-to-section', order },
      '*',
    );
  }, []);

  useEffect(() => {
    scrollToSection(selectedOrder);
  }, [selectedOrder, scrollToSection]);

  const enhancedHtml = injectBridgeScript(previewHtml);

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

        <div className="flex items-center gap-2">
          {selectedOrder && (
            <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs text-blue-600">
              섹션 {selectedOrder} 선택됨
            </span>
          )}
          {isLiveUpdating && !isRebuilding && (
            <span className="text-xs text-gray-400 animate-pulse">실시간 반영 중...</span>
          )}
          {isRebuilding && (
            <span className="text-xs text-blue-600 animate-pulse">미리보기 갱신 중...</span>
          )}
        </div>
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
            ref={iframeRef}
            srcDoc={enhancedHtml}
            className="w-full h-full min-h-[600px]"
            title="페이지 미리보기"
            sandbox="allow-scripts"
          />
        </div>
      </div>
    </div>
  );
}
