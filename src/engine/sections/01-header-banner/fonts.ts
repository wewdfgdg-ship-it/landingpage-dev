// ============================================================
// Header Banner — Font CDN Loader
// 12 FontSet CDN URL 매핑 + HTML link/style 태그 생성
// ============================================================

import type { FontSetId } from './types';

// ── Google Fonts base URL ──

const GF = 'https://fonts.googleapis.com/css2';

// ── CDN URL constants ──

const CDN = {
  pretendard:
    'https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.css',
  nanumSquareNeo:
    'https://cdn.jsdelivr.net/gh/moonspam/NanumSquareNeo@1.0/nanumsquareneo.css',
  godoB:
    'https://cdn.jsdelivr.net/korean-webfonts/1/corps/godo/Godo/GodoB.woff2',
  nexonLv1Bold:
    'https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_20-04@2.1/NEXON%20Lv1%20Gothic%20OTF%20Bold.woff',
  kartriderExtraBold:
    'https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_2312-1@1.1/KartriderExtraBold.woff2',
  nanumSquareRound:
    'https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_two@1.0/NanumSquareRound.woff',
  cafe24Shiningstar:
    'https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_twelve@1.1/Cafe24Shiningstar.woff',
  callifont:
    'https://cdn.jsdelivr.net/gh/projectnoonnu/2510-1@1.0/Callifont-Medium.woff2',
  sbAggroB:
    'https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_2108@1.1/SBAggroB.woff',
  chosunBg:
    'https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_20-04@1.0/ChosunBg.woff',
  a2gBold:
    'https://cdn.jsdelivr.net/gh/projectnoonnu/2601-6@1.0/%EC%97%90%EC%9D%B4%ED%88%AC%EC%A7%80%EC%B2%B4-7Bold.woff2',
  a2gLight:
    'https://cdn.jsdelivr.net/gh/projectnoonnu/2601-6@1.0/%EC%97%90%EC%9D%B4%ED%88%AC%EC%A7%80%EC%B2%B4-3Light.woff2',
  dokrip:
    'https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_twelve@1.1/Dokrip.woff',
  daehanBold:
    'https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_twelve@1.1/Daehan-Bold.woff',
  daehanRegular:
    'https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_twelve@1.1/Daehan-Regular.woff',
  sogang:
    'https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_2312-1@1.1/SOGANGUNIVERSITYTTF.woff2',
  kbizMyungjo:
    'https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_one@1.0/KBIZHanmaumMyungjo.woff',
  hakgyoansimSangjang:
    'https://cdn.jsdelivr.net/gh/projectnoonnu/2510-1@1.0/HakgyoansimSangjangR.woff2',
  paperlogyExtraBold:
    'https://cdn.jsdelivr.net/gh/projectnoonnu/2408-3@1.0/Paperlogy-8ExtraBold.woff2',
} as const;

// ── Google Fonts URL builders ──

function gfUrl(family: string, specs?: string): string {
  const encoded = family.replace(/ /g, '+');
  return specs
    ? `${GF}?family=${encoded}:${specs}&display=swap`
    : `${GF}?family=${encoded}&display=swap`;
}

// ── @font-face builder ──

function fontFace(family: string, url: string, _weight: number): string {
  const format = url.endsWith('.woff2') ? 'woff2' : 'woff';
  return [
    `@font-face {`,
    `  font-family: '${family}';`,
    `  src: url('${url}') format('${format}');`,
    `  font-weight: 1 999;`,
    `  font-display: swap;`,
    `}`,
  ].join('\n');
}

// ── Font set definition ──

interface FontSource {
  /** @import CSS URL (Google Fonts, Pretendard, NanumSquareNeo 등) */
  imports: readonly string[];
  /** @font-face 선언이 필요한 폰트 */
  fontFaces: readonly string[];
}

interface FontFamilies {
  readonly headline: string;
  readonly sub: string;
  readonly micro: string;
}

interface FontSetEntry {
  readonly source: FontSource;
  readonly families: FontFamilies;
}

// ── 12 FontSet 정의 ──

const FONT_SET_MAP: Record<FontSetId, FontSetEntry> = {
  'SET-1': {
    source: {
      imports: [
        CDN.pretendard,
        CDN.nanumSquareNeo,
      ],
      fontFaces: [
        fontFace('KartriderExtraBold', CDN.kartriderExtraBold, 800),
      ],
    },
    families: {
      headline: "'KartriderExtraBold', sans-serif",
      sub: "'NanumSquareNeo', sans-serif",
      micro: "'Pretendard', sans-serif",
    },
  },

  'SET-2': {
    source: {
      imports: [
        CDN.pretendard,
        gfUrl('Noto Serif KR', 'wght@400;700'),
      ],
      fontFaces: [
        fontFace('NEXON Lv1 Gothic OTF Bold', CDN.nexonLv1Bold, 700),
      ],
    },
    families: {
      headline: "'NEXON Lv1 Gothic OTF Bold', sans-serif",
      sub: "'Pretendard', sans-serif",
      micro: "'Noto Serif KR', serif",
    },
  },

  'SET-3': {
    source: {
      imports: [
        CDN.pretendard,
        gfUrl('Noto Sans KR', 'wght@300;400;700;900'),
      ],
      fontFaces: [
        fontFace('GodoB', CDN.godoB, 700),
      ],
    },
    families: {
      headline: "'GodoB', sans-serif",
      sub: "'Pretendard', sans-serif",
      micro: "'Noto Sans KR', sans-serif",
    },
  },

  'SET-4': {
    source: {
      imports: [
        CDN.pretendard,
        gfUrl('Nanum Gothic', 'wght@400;700;800'),
      ],
      fontFaces: [
        fontFace('Cafe24Shiningstar', CDN.cafe24Shiningstar, 400),
      ],
    },
    families: {
      headline: "'Cafe24Shiningstar', cursive",
      sub: "'Nanum Gothic', sans-serif",
      micro: "'Pretendard', sans-serif",
    },
  },

  'SET-5': {
    source: {
      imports: [
        CDN.pretendard,
        gfUrl('Black Han Sans'),
      ],
      fontFaces: [
        fontFace('Callifont', CDN.callifont, 500),
      ],
    },
    families: {
      headline: "'Callifont', sans-serif",
      sub: "'Black Han Sans', sans-serif",
      micro: "'Pretendard', sans-serif",
    },
  },

  'SET-6': {
    source: {
      imports: [
        CDN.pretendard,
        gfUrl('Nanum Gothic', 'wght@400;700;800'),
      ],
      fontFaces: [
        fontFace('NanumSquareRound', CDN.nanumSquareRound, 800),
      ],
    },
    families: {
      headline: "'NanumSquareRound', sans-serif",
      sub: "'Nanum Gothic', sans-serif",
      micro: "'Pretendard', sans-serif",
    },
  },

  'SET-7': {
    source: {
      imports: [
        gfUrl('Do Hyeon'),
      ],
      fontFaces: [
        fontFace('Paperlogy', CDN.paperlogyExtraBold, 800),
        fontFace('NanumSquareRound', CDN.nanumSquareRound, 400),
      ],
    },
    families: {
      headline: "'Paperlogy', sans-serif",
      sub: "'Do Hyeon', sans-serif",
      micro: "'NanumSquareRound', sans-serif",
    },
  },

  'SET-8': {
    source: {
      imports: [
        CDN.pretendard,
        CDN.nanumSquareNeo,
      ],
      fontFaces: [
        fontFace('SBAggroB', CDN.sbAggroB, 700),
      ],
    },
    families: {
      headline: "'SBAggroB', sans-serif",
      sub: "'NanumSquareNeo', sans-serif",
      micro: "'Pretendard', sans-serif",
    },
  },

  'SET-9': {
    source: {
      imports: [
        CDN.pretendard,
      ],
      fontFaces: [
        fontFace('ChosunBg', CDN.chosunBg, 700),
        fontFace('A2G Bold', CDN.a2gBold, 700),
      ],
    },
    families: {
      headline: "'ChosunBg', serif",
      sub: "'A2G Bold', sans-serif",
      micro: "'Pretendard', sans-serif",
    },
  },

  'SET-10': {
    source: {
      imports: [],
      fontFaces: [
        fontFace('Dokrip', CDN.dokrip, 400),
        fontFace('Daehan', CDN.daehanRegular, 400),
        fontFace('KBIZHanmaumMyungjo', CDN.kbizMyungjo, 400),
      ],
    },
    families: {
      headline: "'Dokrip', serif",
      sub: "'Daehan', sans-serif",
      micro: "'KBIZHanmaumMyungjo', serif",
    },
  },

  'SET-11': {
    source: {
      imports: [
        CDN.pretendard,
        gfUrl('Nanum Gothic', 'wght@400;700;800'),
      ],
      fontFaces: [
        fontFace('HakgyoansimSangjang', CDN.hakgyoansimSangjang, 400),
      ],
    },
    families: {
      headline: "'HakgyoansimSangjang', cursive",
      sub: "'Nanum Gothic', sans-serif",
      micro: "'Pretendard', sans-serif",
    },
  },

  'SET-12': {
    source: {
      imports: [],
      fontFaces: [
        fontFace('SOGANGUNIVERSITY', CDN.sogang, 400),
        fontFace('A2G Light', CDN.a2gLight, 300),
        fontFace('Daehan', CDN.daehanRegular, 400),
      ],
    },
    families: {
      headline: "'SOGANGUNIVERSITY', serif",
      sub: "'A2G Light', sans-serif",
      micro: "'Daehan', sans-serif",
    },
  },

  'SET-13': {
    source: {
      imports: [
        gfUrl('Noto Serif KR', 'wght@400;700;900'),
        gfUrl('Noto Sans KR', 'wght@300;400;700;900'),
      ],
      fontFaces: [],
    },
    families: {
      headline: "'Noto Serif KR', serif",
      sub: "'Noto Sans KR', sans-serif",
      micro: "'Noto Sans KR', sans-serif",
    },
  },

  'SET-14': {
    source: {
      imports: [
        CDN.pretendard,
        gfUrl('Gmarket Sans', 'wght@300;500;700'),
      ],
      fontFaces: [],
    },
    families: {
      headline: "'Gmarket Sans', sans-serif",
      sub: "'Pretendard', sans-serif",
      micro: "'Pretendard', sans-serif",
    },
  },

  'SET-15': {
    source: {
      imports: [
        CDN.pretendard,
        gfUrl('Noto Serif KR', 'wght@400;700;900'),
      ],
      fontFaces: [],
    },
    families: {
      headline: "'Noto Serif KR', serif",
      sub: "'Pretendard', sans-serif",
      micro: "'Noto Serif KR', serif",
    },
  },
};

// ── Exported FONT_SET_CDN ──

export interface FontSetCdnEntry {
  /** @import 가능한 CSS URL 목록 */
  readonly imports: readonly string[];
  /** @font-face CSS 선언 문자열 목록 */
  readonly fontFaces: readonly string[];
}

export const FONT_SET_CDN: Record<FontSetId, FontSetCdnEntry> = Object.fromEntries(
  (Object.entries(FONT_SET_MAP) as [FontSetId, FontSetEntry][]).map(
    ([id, entry]) => [id, entry.source],
  ),
) as Record<FontSetId, FontSetCdnEntry>;

// ── getFontLinks ──

/**
 * fontSetId에 해당하는 HTML <link> + <style> 태그 문자열을 반환한다.
 * - @import CSS: <link rel="stylesheet"> 태그
 * - @font-face: <style> 태그 내부에 삽입
 */
export function getFontLinks(fontSetId: FontSetId): string {
  const entry = FONT_SET_MAP[fontSetId];
  const parts: string[] = [];

  for (const url of entry.source.imports) {
    parts.push(
      `<link rel="stylesheet" href="${url}" />`,
    );
  }

  if (entry.source.fontFaces.length > 0) {
    parts.push(
      `<style>\n${entry.source.fontFaces.join('\n\n')}\n</style>`,
    );
  }

  return parts.join('\n');
}

// ── getFontFamilies ──

/**
 * fontSetId에 해당하는 CSS font-family 값을 반환한다.
 * { headline, sub, micro } — micro는 trust/badge 역할도 겸함.
 */
export function getFontFamilies(
  fontSetId: FontSetId,
): { readonly headline: string; readonly sub: string; readonly micro: string } {
  return FONT_SET_MAP[fontSetId].families;
}
