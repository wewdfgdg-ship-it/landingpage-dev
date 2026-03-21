"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import type { SectionKey } from "@/engine/sections/types";

// ============================================================
// 수동 모드 — 섹션 선택기 컴포넌트
// 26개 섹션 카탈로그에서 원하는 섹션 선택 + 순서 지정
// ============================================================

interface SectionMeta {
  key: SectionKey;
  label: string;
  description: string;
  category: "필수" | "제품" | "신뢰" | "전환" | "부가";
}

const SECTION_CATALOG: SectionMeta[] = [
  { key: "HEADER_BANNER", label: "헤더 배너", description: "시선을 사로잡는 메인 비주얼", category: "필수" },
  { key: "CTA", label: "행동 유도", description: "구매/가입 등 최종 행동 촉구", category: "필수" },
  { key: "KEY_FEATURES", label: "핵심 기능", description: "제품의 주요 특장점 3~4가지", category: "제품" },
  { key: "FEATURE_DETAIL_1", label: "기능 상세 1", description: "첫 번째 핵심 기능 딥다이브", category: "제품" },
  { key: "FEATURE_DETAIL_2", label: "기능 상세 2", description: "두 번째 핵심 기능 딥다이브", category: "제품" },
  { key: "FEATURE_DETAIL_3", label: "기능 상세 3", description: "세 번째 핵심 기능 딥다이브", category: "제품" },
  { key: "SPECS", label: "상세 스펙", description: "제품 사양/스펙 테이블", category: "제품" },
  { key: "HOW_TO_USE", label: "사용 방법", description: "단계별 사용법 가이드", category: "제품" },
  { key: "PACKAGE_CONTENTS", label: "구성품", description: "패키지 구성 내용물", category: "제품" },
  { key: "LIFESTYLE", label: "라이프스타일", description: "실제 사용 장면 비주얼", category: "제품" },
  { key: "REVIEWS", label: "텍스트 리뷰", description: "고객 텍스트 리뷰 모음", category: "신뢰" },
  { key: "PHOTO_REVIEWS", label: "포토 리뷰", description: "사진 포함 고객 리뷰", category: "신뢰" },
  { key: "CERTIFICATION", label: "인증/수상", description: "공인 인증 및 수상 내역", category: "신뢰" },
  { key: "STATS_NUMBERS", label: "숫자 증명", description: "임상 결과, 판매 수치 등", category: "신뢰" },
  { key: "COMPETITOR_COMPARE", label: "경쟁사 비교", description: "경쟁 제품 대비 장점", category: "신뢰" },
  { key: "BRAND_STORY", label: "브랜드 스토리", description: "브랜드의 비전과 철학", category: "신뢰" },
  { key: "SNS_VIRAL", label: "SNS 반응", description: "SNS 바이럴 / 인플루언서", category: "신뢰" },
  { key: "TARGET_PERSONA", label: "타겟 페르소나", description: "이런 분께 추천합니다", category: "전환" },
  { key: "BEFORE_AFTER", label: "비포/애프터", description: "사용 전후 변화 비교", category: "전환" },
  { key: "FAQ", label: "자주 묻는 질문", description: "구매 전 궁금증 해소", category: "전환" },
  { key: "BUNDLE_SET", label: "번들/세트", description: "세트 상품 구성 비교", category: "전환" },
  { key: "LIMITED_OFFER", label: "한정 특가", description: "기간/수량 한정 프로모션", category: "전환" },
  { key: "PRICE_TABLE", label: "가격표", description: "요금제 비교 테이블", category: "전환" },
  { key: "SHIPPING", label: "배송 정보", description: "배송 방법 및 일정", category: "부가" },
  { key: "REFUND_POLICY", label: "환불 정책", description: "교환/환불/보증 안내", category: "부가" },
  { key: "CUSTOMER_SERVICE", label: "고객 지원", description: "상담/지원 채널 안내", category: "부가" },
];

const CATEGORIES = ["필수", "제품", "신뢰", "전환", "부가"] as const;

const CATEGORY_COLORS: Record<string, string> = {
  "필수": "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  "제품": "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  "신뢰": "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  "전환": "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  "부가": "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400",
};

interface SectionSelectorProps {
  projectId: string;
  onGenerate: (sections: { sectionKey: SectionKey; order: number }[]) => void;
  isGenerating?: boolean;
}

export function SectionSelector({
  projectId: _projectId,
  onGenerate,
  isGenerating = false,
}: SectionSelectorProps): React.JSX.Element {
  const [selected, setSelected] = useState<SectionKey[]>([
    "HEADER_BANNER",
    "CTA",
  ]);
  const [activeCategory, setActiveCategory] = useState<string>("전체");

  const toggleSection = useCallback((key: SectionKey): void => {
    setSelected((prev) => {
      if (prev.includes(key)) {
        return prev.filter((k) => k !== key);
      }
      if (prev.length >= 20) return prev;
      return [...prev, key];
    });
  }, []);

  const moveUp = useCallback((key: SectionKey): void => {
    setSelected((prev) => {
      const idx = prev.indexOf(key);
      if (idx <= 0) return prev;
      const next = [...prev];
      [next[idx - 1], next[idx]] = [next[idx], next[idx - 1]];
      return next;
    });
  }, []);

  const moveDown = useCallback((key: SectionKey): void => {
    setSelected((prev) => {
      const idx = prev.indexOf(key);
      if (idx < 0 || idx >= prev.length - 1) return prev;
      const next = [...prev];
      [next[idx], next[idx + 1]] = [next[idx + 1], next[idx]];
      return next;
    });
  }, []);

  const handleGenerate = useCallback((): void => {
    const sections = selected.map((key, i) => ({
      sectionKey: key,
      order: i + 1,
    }));
    onGenerate(sections);
  }, [selected, onGenerate]);

  const filteredCatalog = activeCategory === "전체"
    ? SECTION_CATALOG
    : SECTION_CATALOG.filter((s) => s.category === activeCategory);

  const labelMap = Object.fromEntries(
    SECTION_CATALOG.map((s) => [s.key, s.label]),
  );

  return (
    <div className="flex flex-col gap-6 lg:flex-row">
      {/* 왼쪽: 섹션 카탈로그 */}
      <div className="flex-1">
        <h3 className="mb-3 text-lg font-semibold">섹션 선택</h3>
        <p className="mb-4 text-sm text-muted-foreground">
          랜딩페이지에 포함할 섹션을 선택하세요 (최대 20개)
        </p>

        {/* 카테고리 필터 */}
        <div className="mb-4 flex flex-wrap gap-2">
          <Button
            variant={activeCategory === "전체" ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveCategory("전체")}
          >
            전체
          </Button>
          {CATEGORIES.map((cat) => (
            <Button
              key={cat}
              variant={activeCategory === cat ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </Button>
          ))}
        </div>

        {/* 섹션 그리드 */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {filteredCatalog.map((section) => {
            const isSelected = selected.includes(section.key);
            return (
              <button
                key={section.key}
                type="button"
                onClick={() => toggleSection(section.key)}
                className={`rounded-lg border p-3 text-left transition-all ${
                  isSelected
                    ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                    : "border-border hover:border-primary/40 hover:bg-muted/50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{section.label}</span>
                  <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs ${CATEGORY_COLORS[section.category]}`}>
                    {section.category}
                  </span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  {section.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* 오른쪽: 선택된 섹션 순서 */}
      <div className="w-full lg:w-80">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              선택된 섹션 ({selected.length}/20)
            </CardTitle>
            <CardDescription>
              드래그 또는 화살표로 순서를 변경하세요
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {selected.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">
                왼쪽에서 섹션을 선택하세요
              </p>
            ) : (
              selected.map((key, idx) => (
                <div
                  key={key}
                  className="flex items-center gap-2 rounded-lg border border-border bg-background p-2"
                >
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                    {idx + 1}
                  </span>
                  <span className="flex-1 text-sm font-medium">
                    {labelMap[key] ?? key}
                  </span>
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => moveUp(key)}
                      disabled={idx === 0}
                      className="rounded p-1 text-muted-foreground hover:bg-muted disabled:opacity-30"
                      aria-label="위로"
                    >
                      ▲
                    </button>
                    <button
                      type="button"
                      onClick={() => moveDown(key)}
                      disabled={idx === selected.length - 1}
                      className="rounded p-1 text-muted-foreground hover:bg-muted disabled:opacity-30"
                      aria-label="아래로"
                    >
                      ▼
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleSection(key)}
                      className="rounded p-1 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                      aria-label="삭제"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))
            )}
          </CardContent>
          <CardFooter>
            <Button
              className="w-full"
              onClick={handleGenerate}
              disabled={selected.length < 2 || isGenerating}
            >
              {isGenerating ? "생성 중..." : `${selected.length}개 섹션으로 생성하기`}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
