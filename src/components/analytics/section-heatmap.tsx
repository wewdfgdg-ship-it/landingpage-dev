'use client';

import { useMemo } from 'react';

interface SectionData {
  sectionId: string;
  order: number;
  role: string;
  type: string;
  headline: string | null;
  totalImpressions: number;
  totalCtaClicks: number;
  avgDwellTime: number;
  avgExitRate: number;
}

interface SectionHeatmapProps {
  sections: SectionData[];
}

const ROLE_LABELS: Record<string, string> = {
  HOOK: '훅',
  PAIN: '고통',
  SOLUTION: '솔루션',
  PROOF: '증거',
  OBJECTION: '저항파괴',
  URGENCY: '긴급',
  CTA: 'CTA',
  FEATURE: '기능',
  BENEFIT: '혜택',
};

function getHeatColor(value: number, max: number): string {
  if (max === 0) return '#f3f4f6';
  const ratio = value / max;
  if (ratio > 0.8) return '#15803d'; // green-700
  if (ratio > 0.6) return '#16a34a'; // green-600
  if (ratio > 0.4) return '#22c55e'; // green-500
  if (ratio > 0.2) return '#86efac'; // green-300
  return '#dcfce7'; // green-100
}

function getExitColor(rate: number): string {
  if (rate > 50) return '#dc2626'; // red-600
  if (rate > 30) return '#f97316'; // orange-500
  if (rate > 15) return '#eab308'; // yellow-500
  return '#22c55e'; // green-500
}

export function SectionHeatmap({ sections }: SectionHeatmapProps): React.ReactElement {
  const maxImpressions = useMemo(
    () => Math.max(...sections.map((s) => s.totalImpressions), 1),
    [sections],
  );

  if (sections.length === 0) {
    return (
      <div className="flex items-center justify-center rounded-lg border border-dashed border-gray-200 py-12 text-sm text-gray-400">
        섹션 데이터가 없습니다
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {/* 헤더 */}
      <div className="grid grid-cols-[40px_1fr_80px_80px_80px_80px] gap-2 px-3 text-xs font-medium text-gray-500">
        <div>#</div>
        <div>섹션</div>
        <div className="text-right">노출</div>
        <div className="text-right">체류(초)</div>
        <div className="text-right">이탈률</div>
        <div className="text-right">CTA</div>
      </div>

      {/* 행 */}
      {sections.map((section) => (
        <div
          key={section.sectionId}
          className="grid grid-cols-[40px_1fr_80px_80px_80px_80px] items-center gap-2 rounded-lg border border-gray-100 bg-white px-3 py-2.5 transition-colors hover:bg-gray-50"
        >
          {/* 순서 */}
          <div className="text-sm font-bold text-gray-400">{section.order}</div>

          {/* 섹션 정보 + 히트바 */}
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="inline-flex rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-medium text-gray-600">
                {ROLE_LABELS[section.role] ?? section.role}
              </span>
              <span className="truncate text-sm text-gray-800">
                {section.headline ?? section.type}
              </span>
            </div>
            {/* 히트 바 */}
            <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-gray-100">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${(section.totalImpressions / maxImpressions) * 100}%`,
                  backgroundColor: getHeatColor(section.totalImpressions, maxImpressions),
                }}
              />
            </div>
          </div>

          {/* 노출 */}
          <div className="text-right text-sm font-medium text-gray-700">
            {section.totalImpressions.toLocaleString()}
          </div>

          {/* 체류시간 */}
          <div className="text-right text-sm text-gray-600">
            {section.avgDwellTime}s
          </div>

          {/* 이탈률 */}
          <div className="text-right">
            <span
              className="inline-flex rounded px-1.5 py-0.5 text-xs font-medium"
              style={{
                color: getExitColor(section.avgExitRate),
                backgroundColor: `${getExitColor(section.avgExitRate)}15`,
              }}
            >
              {section.avgExitRate}%
            </span>
          </div>

          {/* CTA 클릭 */}
          <div className="text-right text-sm font-medium text-blue-600">
            {section.totalCtaClicks}
          </div>
        </div>
      ))}

      {/* 범례 */}
      <div className="flex items-center justify-end gap-4 pt-2 text-xs text-gray-400">
        <div className="flex items-center gap-1">
          <div className="h-2 w-2 rounded-full bg-green-500" /> 높은 노출
        </div>
        <div className="flex items-center gap-1">
          <div className="h-2 w-2 rounded-full bg-red-500" /> 높은 이탈
        </div>
      </div>
    </div>
  );
}
