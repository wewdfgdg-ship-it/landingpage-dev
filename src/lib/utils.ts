import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

// ============================================================
// 클래스 병합
// ============================================================

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}

// ============================================================
// 날짜 포맷
// ============================================================

/** 상대 시간 표시 (e.g. "3분 전", "2일 전") */
export function formatRelativeTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffSec = Math.floor(diffMs / 1_000);
  const diffMin = Math.floor(diffMs / 60_000);
  const diffHour = Math.floor(diffMs / 3_600_000);
  const diffDay = Math.floor(diffMs / 86_400_000);

  if (diffSec < 60) return '방금 전';
  if (diffMin < 60) return `${diffMin}분 전`;
  if (diffHour < 24) return `${diffHour}시간 전`;
  if (diffDay < 7) return `${diffDay}일 전`;
  if (diffDay < 30) return `${Math.floor(diffDay / 7)}주 전`;

  return d.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/** 한국어 날짜 문자열 (e.g. "2026. 3. 21.") */
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('ko-KR');
}

/** 한국어 날짜+시간 문자열 (e.g. "2026. 3. 21. 오후 3:45") */
export function formatDateTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleString('ko-KR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

/** 기간 표시 (e.g. "3월 1일 ~ 3월 21일") */
export function formatDateRange(start: Date | string, end: Date | string): string {
  const s = typeof start === 'string' ? new Date(start) : start;
  const e = typeof end === 'string' ? new Date(end) : end;
  const fmt = (d: Date): string =>
    d.toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' });
  return `${fmt(s)} ~ ${fmt(e)}`;
}

// ============================================================
// 숫자 포맷
// ============================================================

/** 숫자를 한국식 콤마 표기 (e.g. 1,234,567) */
export function formatNumber(value: number): string {
  return value.toLocaleString('ko-KR');
}

/** 퍼센트 표시 (e.g. "12.5%") */
export function formatPercent(value: number, decimals: number = 1): string {
  return `${value.toFixed(decimals)}%`;
}

/** 통화 표시 (e.g. "₩1,234,567") */
export function formatCurrency(amount: number, currency: string = 'KRW'): string {
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

/** 큰 숫자 축약 (e.g. 1200 → "1.2K", 1500000 → "1.5M") */
export function formatCompact(value: number): string {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
  return String(value);
}

// ============================================================
// 문자열 유틸
// ============================================================

/** 문자열을 최대 길이로 자르고 말줄임 */
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return `${str.slice(0, maxLength)}…`;
}

/** slug 생성 (한글 포함) */
export function slugify(str: string): string {
  return str
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w가-힣-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

// ============================================================
// 기타 유틸
// ============================================================

/** 지정된 ms만큼 대기 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** 배열을 n개씩 묶기 */
export function chunk<T>(array: T[], size: number): T[][] {
  const result: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
}

/** 값이 비어있지 않은지 확인 (null, undefined, 빈 문자열 제외) */
export function isNotEmpty(value: unknown): boolean {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  return true;
}
