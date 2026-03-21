import type { CopyBlock } from '@/engine/05-psychological-copy/types';
import type { DesignTokens } from '@/engine/09-visual-style/types';

// ============================================================
// Template Engine v2 — 슬롯 기반 콘텐츠 주입
// ============================================================

/** 템플릿 슬롯에 CopyBlock 데이터 주입 */
export function injectContent(template: string, copy: CopyBlock): string {
  let result = template;

  // 헤드라인: {{headline}} = HTML 버전 (크기 차등), {{headlineText}} = 순수 텍스트
  const headlineText = copy.headline.replace(/\n/g, ' ');
  result = result.replace(/\{\{headlineText\}\}/g, esc(headlineText));

  // 로우 슬롯 치환 (HTML 허용) - {{{var}}} 형태 지원. (단순 치환보다 먼저 실행되어야 괄호 찌꺼기가 안 남음)
  result = result.replace(/\{\{\{headline\}\}\}/g, copy.headline);
  result = result.replace(/\{\{\{subheadline\}\}\}/g, copy.subheadline);
  result = result.replace(/\{\{\{body\}\}\}/g, copy.body);
  result = result.replace(/\{\{\{microCopy\}\}\}/g, copy.microCopy);
  for (let i = 0; i < 20; i++) {
    result = result.replace(new RegExp(`\\{\\{\\{bullet\\.${i}\\}\\}\\}`, 'g'), copy.bulletPoints[i] ?? '');
  }

  const headlineLines = copy.headline.split('\n').filter(Boolean);
  if (headlineLines.length >= 2) {
    const headlineHtml = `<span class="headline-sm">${esc(headlineLines[0])}</span><br><span class="headline-lg">${esc(headlineLines.slice(1).join(' '))}</span>`;
    result = result.replace(/\{\{headline\}\}/g, headlineHtml);
  } else {
    result = result.replace(/\{\{headline\}\}/g, esc(copy.headline));
  }

  // (로우 슬롯 치환 구문이 여기 있었음 - 위로 이동됨)

  // 단순 슬롯 치환
  result = result.replace(/\{\{subheadline\}\}/g, esc(copy.subheadline));
  result = result.replace(/\{\{body\}\}/g, esc(copy.body));
  result = result.replace(/\{\{ctaText\}\}/g, esc(copy.ctaText));
  result = result.replace(/\{\{microCopy\}\}/g, esc(copy.microCopy));
  result = result.replace(/\{\{imageUrl\}\}/g, copy.imageUrl ?? '');
  result = result.replace(/\{\{imageDirection\}\}/g, esc(copy.imageDirection));

  // bulletPoints 개별 접근: {{bullet.0}}, {{bullet.1}}, ...
  for (let i = 0; i < 20; i++) {
    result = result.replace(
      new RegExp(`\\{\\{bullet\\.${i}\\}\\}`, 'g'),
      esc(copy.bulletPoints[i] ?? ''),
    );
  }

  result = processConditional(result, 'imageUrl', !!copy.imageUrl);
  result = processConditional(result, 'headline', !!copy.headline);
  result = processConditional(result, 'microCopy', !!copy.microCopy);
  result = processConditional(result, 'ctaText', !!copy.ctaText);
  result = processConditional(result, 'body', !!copy.body);
  result = processConditional(result, 'subheadline', !!copy.subheadline);
  result = processConditional(result, 'bullets', copy.bulletPoints && copy.bulletPoints.length > 0);

  // bullet.0 ~ bullet.19 조건부 처리
  for (let i = 0; i < 20; i++) {
    result = processConditional(result, `bullet.${i}`, !!(copy.bulletPoints && copy.bulletPoints[i]));
  }

  // bulletPoints 반복: {{#each bullets}}...{{/each bullets}}
  result = processLoop(result, 'bullets', copy.bulletPoints);

  return result;
}

/** DesignTokens → CSS 변수 문자열 */
export function tokensToCssVars(tokens: DesignTokens): string {
  const c = tokens.colors;
  const t = tokens.typography;
  const s = tokens.spacing;
  const r = tokens.radius;
  const ff =
    tokens.fontFamily === 'serif'
      ? "'Noto Serif KR', Georgia, serif"
      : tokens.fontFamily === 'mono'
        ? "'JetBrains Mono', 'Noto Sans KR', monospace"
        : "'Pretendard', 'Noto Sans KR', -apple-system, sans-serif";

  return `:root {
  --color-primary: ${c.primary};
  --color-primary-light: ${c.primaryLight};
  --color-primary-dark: ${c.primaryDark};
  --color-secondary: ${c.secondary};
  --color-accent: ${c.accent};
  --color-bg: ${c.background};
  --color-surface: ${c.surface};
  --color-text: ${c.textPrimary};
  --color-text-secondary: ${c.textSecondary};
  --color-text-muted: ${c.textMuted};
  --color-border: ${c.border};
  --color-error: ${c.error};
  --font-family: ${ff};
  --font-display: ${t.display.size};
  --font-h1: ${t.h1.size};
  --font-h2: ${t.h2.size};
  --font-h3: ${t.h3.size};
  --font-body: ${t.body.size};
  --font-small: ${t.small.size};
  --font-caption: ${t.caption.size};
  --spacing-xs: ${s.xs}px;
  --spacing-sm: ${s.sm}px;
  --spacing-md: ${s.md}px;
  --spacing-lg: ${s.lg}px;
  --spacing-xl: ${s.xl}px;
  --spacing-2xl: ${s['2xl']}px;
  --radius-none: ${r.none}px;
  --radius-sm: ${r.sm}px;
  --radius-md: ${r.md}px;
  --radius-lg: ${r.lg}px;
  --radius-xl: ${r.xl}px;
  --radius-full: ${r.full}px;
}`;
}

/** 템플릿 CSS에 디자인 토큰 주입 */
export function injectTokens(css: string, tokens: DesignTokens): string {
  const c = tokens.colors;
  let result = css;
  result = result.replace(/\{\{primary\}\}/g, c.primary);
  result = result.replace(/\{\{primaryLight\}\}/g, c.primaryLight);
  result = result.replace(/\{\{primaryDark\}\}/g, c.primaryDark);
  result = result.replace(/\{\{secondary\}\}/g, c.secondary);
  result = result.replace(/\{\{accent\}\}/g, c.accent);
  result = result.replace(/\{\{background\}\}/g, c.background);
  result = result.replace(/\{\{surface\}\}/g, c.surface);
  result = result.replace(/\{\{textPrimary\}\}/g, c.textPrimary);
  result = result.replace(/\{\{textSecondary\}\}/g, c.textSecondary);
  result = result.replace(/\{\{textMuted\}\}/g, c.textMuted);
  result = result.replace(/\{\{border\}\}/g, c.border);
  return result;
}

// --- 내부 유틸 ---

function esc(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function processConditional(template: string, name: string, condition: boolean): string {
  const regex = new RegExp(`\\{\\{#if ${name}\\}\\}([\\s\\S]*?)\\{\\{/if ${name}\\}\\}`, 'g');
  return template.replace(regex, condition ? '$1' : '');
}

function processLoop(template: string, name: string, items: string[]): string {
  const regex = new RegExp(`\\{\\{#each ${name}\\}\\}([\\s\\S]*?)\\{\\{/each ${name}\\}\\}`, 'g');
  return template.replace(regex, (_match, inner: string) => {
    return items.map((item) => inner.replace(/\{\{this\}\}/g, esc(item))).join('');
  });
}
