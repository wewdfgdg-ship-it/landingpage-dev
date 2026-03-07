// ============================================================
// Cross-Engine Bridge — 엔진 간 교차 반영 (AI 호출 없음)
//
// ① Objection → Copy: 저항파괴 전략을 카피 프롬프트에 주입
// ② Trust    → Layout: 신뢰 요소를 레이아웃 배치에 반영
// ③ Attention→ Code:   Zone별 인터랙션/리듬을 HTML에 보정
// ============================================================

import type { ObjectionMap } from '@/engine/04-objection-killer/types';
import type { CopyBlocks } from '@/engine/05-psychological-copy/types';
import type { TrustConfig } from '@/engine/06-trust-architecture/types';
import type { AttentionConfig, ZoneConfig } from '@/engine/07-attention-architecture/types';
import type { LayoutConfig, SectionLayout } from '@/engine/08-layout-intelligence/types';

// ============================================================
// ① Objection → Copy 주입
//    저항 전략의 copyDirection을 관련 섹션 카피에 보강
// ============================================================

export interface ObjectionCopyInjection {
  sectionOrder: number;
  injectedDirection: string;
  objectionType: string;
}

/**
 * Objection 전략의 copyDirection을 매칭 섹션의 카피에 보강.
 * body 끝에 저항 해소 메시지를 추가하고, microCopy가 비어있으면 채운다.
 */
export function injectObjectionIntoCopy(
  copyBlocks: CopyBlocks,
  objectionMap: ObjectionMap,
  layoutConfig: LayoutConfig,
): { copyBlocks: CopyBlocks; injections: ObjectionCopyInjection[] } {
  const injections: ObjectionCopyInjection[] = [];

  for (const objection of objectionMap.activeObjections) {
    // injectAt 형식: "section_3_pricing"
    for (const target of objection.injectAt) {
      const orderMatch = target.match(/section_(\d+)/);
      if (!orderMatch) continue;
      const targetOrder = parseInt(orderMatch[1], 10);

      const section = copyBlocks.sections.find(
        (s) => s.sectionOrder === targetOrder,
      );
      if (!section) continue;

      // 이미 주입된 내용인지 체크
      if (section.copy.body.includes(objection.copyDirection)) continue;

      // body 보강: 저항 해소 메시지 추가
      const separator = section.copy.body.trim().length > 0 ? ' ' : '';
      section.copy.body = `${section.copy.body}${separator}${objection.copyDirection}`;

      // microCopy가 비어있으면 전략별 기본 마이크로카피
      if (!section.copy.microCopy.trim()) {
        section.copy.microCopy = getObjectionMicroCopy(objection.type);
      }

      // bulletPoints에 전략 포인트 추가 (최대 1개)
      const strategyBullet = getObjectionBullet(objection.type, objection.strategies);
      if (strategyBullet && section.copy.bulletPoints.length < 5) {
        section.copy.bulletPoints.push(strategyBullet);
      }

      injections.push({
        sectionOrder: targetOrder,
        injectedDirection: objection.copyDirection,
        objectionType: objection.type,
      });
    }
  }

  // 레이아웃에서 OBJECTION 역할 섹션에도 주입
  for (const objection of objectionMap.activeObjections) {
    const objSections = layoutConfig.sections.filter(
      (s) => s.role === 'OBJECTION',
    );

    for (const layout of objSections) {
      const section = copyBlocks.sections.find(
        (s) => s.sectionOrder === layout.order,
      );
      if (!section) continue;
      if (injections.some((i) => i.sectionOrder === layout.order && i.objectionType === objection.type)) continue;

      // subheadline이 비어있으면 저항 해소 방향 주입
      if (!section.copy.subheadline.trim()) {
        section.copy.subheadline = objection.copyDirection;
        injections.push({
          sectionOrder: layout.order,
          injectedDirection: objection.copyDirection,
          objectionType: objection.type,
        });
      }
    }
  }

  return { copyBlocks, injections };
}

function getObjectionMicroCopy(type: string): string {
  switch (type) {
    case 'price': return '가격 대비 최고의 가치';
    case 'trust': return '이미 검증된 신뢰';
    case 'need': return '지금 시작이 가장 빠릅니다';
    case 'urgency': return '한정 기간 특별 혜택';
    case 'complexity': return '누구나 쉽게 시작';
    default: return '';
  }
}

function getObjectionBullet(type: string, strategies: string[]): string {
  if (strategies.length === 0) return '';
  switch (type) {
    case 'price':
      return strategies.includes('daily_split')
        ? '하루 커피 한 잔 가격으로 시작'
        : '합리적 투자, 확실한 결과';
    case 'trust':
      return strategies.includes('guarantee_badge')
        ? '100% 만족 보장 제도'
        : '수천 명이 선택한 검증된 서비스';
    case 'need':
      return '지금 해결하지 않으면 계속되는 비효율';
    case 'urgency':
      return strategies.includes('countdown')
        ? '마감 임박 — 지금 신청하세요'
        : '선착순 한정 혜택';
    case 'complexity':
      return strategies.includes('three_step_guide')
        ? '3단계로 끝나는 간단한 시작'
        : '초보자도 5분 만에 설정 완료';
    default:
      return '';
  }
}

// ============================================================
// ② Trust → Layout 배치 반영
//    Trust 레벨별 sectionOrder를 Layout의 reasoning에 병합
//    + 해당 섹션의 패턴 선택에 신뢰 요소 가산점 적용
// ============================================================

export interface TrustLayoutAdjustment {
  sectionOrder: number;
  trustLevel: number;
  trustName: string;
  trustElements: string[];
  adjustedReasoning: string;
}

/**
 * Trust 요소를 Layout에 반영.
 * 각 Trust 요소가 지정한 sectionOrder의 reasoning에 신뢰 요소 정보를 추가.
 */
export function applyTrustToLayout(
  layoutConfig: LayoutConfig,
  trustConfig: TrustConfig,
): { layoutConfig: LayoutConfig; adjustments: TrustLayoutAdjustment[] } {
  const adjustments: TrustLayoutAdjustment[] = [];

  for (const trust of trustConfig.trustElements) {
    const section = layoutConfig.sections.find(
      (s) => s.order === trust.sectionOrder,
    );
    if (!section) continue;

    // reasoning에 신뢰 요소 정보 병합
    const trustInfo = `+Trust(Lv${trust.level}:${trust.name}/${trust.elements.join(',')})`;
    section.reasoning = `${section.reasoning} ${trustInfo}`;

    // 신뢰 요소가 사회증명이면 social_proof 패턴 선호도 높이기
    if (trust.level >= 3 && trust.level <= 4) {
      boostSocialProofPattern(section);
    }

    // 안전장치(Lv5)면 FAQ/보증 패턴 선호
    if (trust.level === 5) {
      boostSafetyPattern(section);
    }

    adjustments.push({
      sectionOrder: trust.sectionOrder,
      trustLevel: trust.level,
      trustName: trust.name,
      trustElements: trust.elements,
      adjustedReasoning: section.reasoning,
    });
  }

  return { layoutConfig, adjustments };
}

/** social_proof 관련 패턴이면 점수 보너스 */
function boostSocialProofPattern(section: SectionLayout): void {
  const socialPatterns = [
    'proof_review_carousel', 'proof_testimonial_card', 'proof_logo_bar',
    'proof_rating_text', 'proof_number_counter',
  ];
  if (socialPatterns.includes(section.selectedPattern)) {
    section.score = Math.min(100, section.score + 10);
  }
}

/** FAQ/보증 관련 패턴이면 점수 보너스 */
function boostSafetyPattern(section: SectionLayout): void {
  const safetyPatterns = ['faq_accordion', 'faq_2col', 'faq_search'];
  if (safetyPatterns.includes(section.selectedPattern)) {
    section.score = Math.min(100, section.score + 10);
  }
}

// ============================================================
// ③ Attention → Code Engine Zone 보정
//    Zone별 인터랙션 힌트를 섹션 HTML에 data-* 속성으로 주입
//    Code Engine이 이 속성을 읽어 스타일 보정
// ============================================================

export interface ZoneAnnotation {
  sectionOrder: number;
  zone: string;
  rhythm: string;
  interactions: string[];
  visualRatio: number;
  restrictions: string[];
}

/**
 * 각 섹션이 어떤 Zone에 속하는지 계산하고,
 * Zone의 인터랙션/리듬/비율 정보를 어노테이션으로 반환.
 * Code Engine이 이 정보로 HTML을 보정한다.
 */
export function annotateZones(
  layoutConfig: LayoutConfig,
  attentionConfig: AttentionConfig,
): ZoneAnnotation[] {
  const totalSections = layoutConfig.sections.length;
  const annotations: ZoneAnnotation[] = [];

  for (const section of layoutConfig.sections) {
    const zone = getZoneForSection(section.order, totalSections, attentionConfig.zones);

    if (zone) {
      annotations.push({
        sectionOrder: section.order,
        zone: zone.zone,
        rhythm: zone.rhythm,
        interactions: zone.interactions,
        visualRatio: zone.visualRatio,
        restrictions: zone.restrictions,
      });
    }
  }

  return annotations;
}

/** 섹션 순서로 해당 Zone 결정 */
function getZoneForSection(
  order: number,
  totalSections: number,
  zones: ZoneConfig[],
): ZoneConfig | undefined {
  const sectionHeight = 600;
  const sectionPixelStart = (order - 1) * sectionHeight;

  return zones.find(
    (z) =>
      sectionPixelStart >= z.pixelRange.start &&
      sectionPixelStart < z.pixelRange.end,
  );
}

/**
 * Zone 어노테이션을 생성된 HTML에 data 속성으로 주입.
 * 기존 data-section-order 래퍼에 Zone 정보를 추가한다.
 */
export function injectZoneAttributes(
  html: string,
  annotations: ZoneAnnotation[],
): string {
  let result = html;

  for (const ann of annotations) {
    const marker = `data-section-order="${ann.sectionOrder}"`;
    const zoneAttrs = `data-zone="${ann.zone}" data-rhythm="${escAttr(ann.rhythm)}" data-interactions="${ann.interactions.join(',')}" data-visual-ratio="${ann.visualRatio}"`;
    result = result.replace(marker, `${marker} ${zoneAttrs}`);
  }

  return result;
}

function escAttr(s: string): string {
  return s.replace(/"/g, '&quot;');
}

// ============================================================
// 통합 브릿지 — 모든 교차 반영을 한 번에 실행
// ============================================================

export interface CrossEngineBridgeResult {
  copyBlocks: CopyBlocks;
  layoutConfig: LayoutConfig;
  zoneAnnotations: ZoneAnnotation[];
  stats: {
    objectionInjections: number;
    trustAdjustments: number;
    zoneAnnotations: number;
  };
}

/**
 * 모든 교차 반영을 순서대로 실행:
 * 1. Objection → Copy (저항파괴 카피 주입)
 * 2. Trust → Layout (신뢰 배치 반영)
 * 3. Attention → Zone 어노테이션 (Code Engine용)
 */
export function runCrossEngineBridge(
  copyBlocks: CopyBlocks,
  objectionMap: ObjectionMap,
  trustConfig: TrustConfig,
  attentionConfig: AttentionConfig,
  layoutConfig: LayoutConfig,
): CrossEngineBridgeResult {
  // ① Objection → Copy
  const { copyBlocks: enrichedCopy, injections } = injectObjectionIntoCopy(
    copyBlocks,
    objectionMap,
    layoutConfig,
  );

  // ② Trust → Layout
  const { layoutConfig: enrichedLayout, adjustments } = applyTrustToLayout(
    layoutConfig,
    trustConfig,
  );

  // ③ Attention → Zone 어노테이션
  const zoneAnnotations = annotateZones(enrichedLayout, attentionConfig);

  return {
    copyBlocks: enrichedCopy,
    layoutConfig: enrichedLayout,
    zoneAnnotations,
    stats: {
      objectionInjections: injections.length,
      trustAdjustments: adjustments.length,
      zoneAnnotations: zoneAnnotations.length,
    },
  };
}
