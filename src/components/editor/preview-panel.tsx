'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useEditorStore } from '@/stores/editor-store';

// ============================================================
// 미리보기 패널 — 중앙
// iframe 실시간 미리보기, 데스크톱/모바일 전환, 양방향 섹션 연동
// ============================================================

/** iframe에 주입할 브릿지 스크립트 — 섹션 클릭 감지 + 스크롤/하이라이트 수신 */
const BRIDGE_SCRIPT = `
<script>
(function() {
  var sections = document.querySelectorAll('section, [data-section]');
  sections.forEach(function(sec, i) {
    sec.setAttribute('data-editor-index', i);
    sec.style.cursor = 'pointer';
    sec.style.transition = 'outline 0.2s ease, box-shadow 0.2s ease';
    sec.addEventListener('click', function(e) {
      e.stopPropagation();
      window.parent.postMessage({ type: 'section-click', index: i }, '*');
    });
  });

  window.addEventListener('message', function(e) {
    if (!e.data || !e.data.type) return;

    if (e.data.type === 'scroll-to-section') {
      var idx = e.data.index;
      var target = sections[idx];
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }

    if (e.data.type === 'highlight-section') {
      sections.forEach(function(sec) {
        sec.style.outline = 'none';
        sec.style.boxShadow = 'none';
      });
      var idx2 = e.data.index;
      if (idx2 !== null && idx2 !== undefined && sections[idx2]) {
        sections[idx2].style.outline = '2px solid #3b82f6';
        sections[idx2].style.boxShadow = '0 0 0 4px rgba(59, 130, 246, 0.15)';
      }
    }
  });
})();
</script>
`;

function injectBridgeScript(html: string): string {
  if (!html) return html;
  const closingBody = html.lastIndexOf('</body>');
  if (closingBody !== -1) {
    return html.slice(0, closingBody) + BRIDGE_SCRIPT + html.slice(closingBody);
  }
  return html + BRIDGE_SCRIPT;
}

export function PreviewPanel(): React.ReactElement {
  const previewHtml = useEditorStore((s) => s.previewHtml);
  const isRebuilding = useEditorStore((s) => s.isRebuilding);
  const previewHighlightOrder = useEditorStore((s) => s.previewHighlightOrder);
  const selectSection = useEditorStore((s) => s.selectSection);
  const sections = useEditorStore((s) => s.sections);

  const [device, setDevice] = useState<'desktop' | 'mobile'>('desktop');
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const injectedHtml = injectBridgeScript(previewHtml);

  // iframe 메시지 수신: 섹션 클릭 → 에디터 섹션 선택
  useEffect(() => {
    const handleMessage = (e: MessageEvent): void => {
      if (!e.data || e.data.type !== 'section-click') return;
      const clickedIndex = e.data.index as number;
      const sec = sections[clickedIndex];
      if (sec) {
        selectSection(sec.order);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [sections, selectSection]);

  // 선택된 섹션 변경 시 → iframe에 스크롤 + 하이라이트 메시지 전송
  const sendMessageToIframe = useCallback(
    (msg: Record<string, unknown>): void => {
      const iframe = iframeRef.current;
      if (!iframe?.contentWindow) return;
      iframe.contentWindow.postMessage(msg, '*');
    },
    [],
  );

  useEffect(() => {
    if (previewHighlightOrder === null) {
      sendMessageToIframe({ type: 'highlight-section', index: null });
      return;
    }
    const sectionIndex = sections.findIndex((s) => s.order === previewHighlightOrder);
    if (sectionIndex !== -1) {
      sendMessageToIframe({ type: 'scroll-to-section', index: sectionIndex });
      sendMessageToIframe({ type: 'highlight-section', index: sectionIndex });
    }
  }, [previewHighlightOrder, sections, sendMessageToIframe]);

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
          {isRebuilding && (
            <span className="text-xs text-blue-600 animate-pulse">미리보기 갱신 중...</span>
          )}
          <span className="text-xs text-gray-400">
            클릭하여 섹션 선택
          </span>
        </div>
      </div>

      {/* iframe 미리보기 */}
      <div className="flex-1 flex justify-center overflow-auto p-4">
        <div
          className="bg-white shadow-lg rounded-lg overflow-hidden transition-all"
          style={{
            width: device === 'mobile' ? '375px' : '100%',
            maxWidth: '100%',
          }}
        >
          <iframe
            ref={iframeRef}
            srcDoc={injectedHtml}
            className="w-full h-full min-h-[600px]"
            title="페이지 미리보기"
            sandbox="allow-scripts"
          />
        </div>
      </div>
    </div>
  );
}
