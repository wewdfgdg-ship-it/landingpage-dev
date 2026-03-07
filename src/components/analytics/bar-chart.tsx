'use client';

import { useMemo, useState } from 'react';

interface BarData {
  label: string;
  value: number;
  color?: string;
}

interface BarChartProps {
  data: BarData[];
  height?: number;
  formatValue?: (v: number) => string;
  showPercent?: boolean;
}

const DEFAULT_COLORS = ['#2563eb', '#7c3aed', '#059669', '#d97706', '#dc2626', '#6366f1', '#0891b2'];

export function BarChart({
  data,
  height = 180,
  formatValue = (v) => String(v),
  showPercent = false,
}: BarChartProps): React.ReactElement {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const { bars } = useMemo(() => {
    const sum = data.reduce((s, d) => s + d.value, 0);
    const max = Math.max(...data.map((d) => d.value), 1);

    const padTop = 15;
    const padBottom = 35;
    const padLeft = 50;
    const padRight = 20;
    const chartW = 600 - padLeft - padRight;
    const chartH = height - padTop - padBottom;
    const barW = Math.min(60, chartW / data.length - 10);
    const gap = (chartW - barW * data.length) / (data.length + 1);

    return {
      bars: data.map((d, i) => ({
        ...d,
        x: padLeft + gap + i * (barW + gap),
        y: padTop + chartH - (d.value / max) * chartH,
        w: barW,
        h: (d.value / max) * chartH,
        color: d.color ?? DEFAULT_COLORS[i % DEFAULT_COLORS.length],
        percent: sum > 0 ? Math.round((d.value / sum) * 100) : 0,
        chartBottom: padTop + chartH,
      })),
      total: sum,
    };
  }, [data, height]);

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center rounded-lg border border-dashed border-gray-200 py-12 text-sm text-gray-400">
        데이터가 없습니다
      </div>
    );
  }

  return (
    <svg viewBox={`0 0 600 ${height}`} className="w-full" preserveAspectRatio="xMidYMid meet">
      {/* 베이스라인 */}
      <line x1="50" y1={height - 35} x2="580" y2={height - 35} stroke="#e5e7eb" strokeWidth="1" />

      {bars.map((bar, i) => (
        <g
          key={i}
          onMouseEnter={() => setHoveredIndex(i)}
          onMouseLeave={() => setHoveredIndex(null)}
          className="cursor-pointer"
        >
          {/* 바 */}
          <rect
            x={bar.x}
            y={bar.y}
            width={bar.w}
            height={bar.h}
            rx="4"
            fill={bar.color}
            fillOpacity={hoveredIndex === i ? 1 : 0.8}
            className="transition-all"
          />

          {/* 값 라벨 */}
          <text
            x={bar.x + bar.w / 2}
            y={bar.y - 5}
            textAnchor="middle"
            fontSize="11"
            fontWeight="600"
            fill={bar.color}
          >
            {showPercent ? `${bar.percent}%` : formatValue(bar.value)}
          </text>

          {/* X축 라벨 */}
          <text
            x={bar.x + bar.w / 2}
            y={height - 12}
            textAnchor="middle"
            fontSize="11"
            fill="#6b7280"
          >
            {bar.label}
          </text>
        </g>
      ))}

      {/* 툴팁 */}
      {hoveredIndex !== null && (
        <g>
          <rect
            x={bars[hoveredIndex].x + bars[hoveredIndex].w / 2 - 50}
            y={bars[hoveredIndex].y - 40}
            width="100"
            height="24"
            rx="4"
            fill="#1f2937"
          />
          <text
            x={bars[hoveredIndex].x + bars[hoveredIndex].w / 2}
            y={bars[hoveredIndex].y - 24}
            textAnchor="middle"
            fontSize="11"
            fill="white"
            fontWeight="600"
          >
            {formatValue(bars[hoveredIndex].value)} ({bars[hoveredIndex].percent}%)
          </text>
        </g>
      )}
    </svg>
  );
}
