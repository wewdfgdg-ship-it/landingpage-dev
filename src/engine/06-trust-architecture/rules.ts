// ============================================================
// Trust Architecture Engine — 비즈니스 규칙
// 신뢰 6레벨 템플릿 정의
// ============================================================

import type { TrustLevel } from './types';

/** 신뢰 레벨 템플릿 */
export interface TrustLevelTemplate {
  level: TrustLevel;
  name: string;
  customerPsychology: string;
  elements: string[];
  targetRoles: string[];
}

/** 신뢰 6레벨 순차 배치 템플릿 */
export const TRUST_TEMPLATES: TrustLevelTemplate[] = [
  {
    level: 1,
    name: '존재감',
    customerPsychology: '이 브랜드 실재하는구나',
    elements: ['브랜드 로고', '프로페셔널 디자인', '커스텀 도메인'],
    targetRoles: ['HOOK'],
  },
  {
    level: 2,
    name: '전문성',
    customerPsychology: '이 분야를 아는구나',
    elements: ['상세 스펙', '기술 설명', '전문 용어 활용'],
    targetRoles: ['SOLUTION'],
  },
  {
    level: 3,
    name: '제3자 검증',
    customerPsychology: '다른 사람도 인정하는구나',
    elements: ['인증 마크', '특허', '수상 경력', '미디어 소개'],
    targetRoles: ['PROOF'],
  },
  {
    level: 4,
    name: '사회 증명',
    customerPsychology: '많은 사람이 쓰는구나',
    elements: ['고객 리뷰', '판매량', '고객사 로고', '별점'],
    targetRoles: ['PROOF'],
  },
  {
    level: 5,
    name: '안전장치',
    customerPsychology: '실패해도 괜찮겠구나',
    elements: ['환불 보증', 'AS 정책', 'FAQ', '고객센터'],
    targetRoles: ['OBJECTION', 'CTA'],
  },
  {
    level: 6,
    name: '동료 압력',
    customerPsychology: '다른 사람도 지금 보고 있구나',
    elements: ['실시간 조회 수', '최근 구매 알림'],
    targetRoles: ['CTA'],
  },
] as const;

/** 신뢰 점수 계산 시 전체 레벨 수 */
export const TOTAL_TRUST_LEVELS = 6 as const;
