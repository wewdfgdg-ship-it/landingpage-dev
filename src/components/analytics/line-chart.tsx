'use client';

import { useMemo, useState } from 'react';

interface DataPoint {
  label: string;
  value: number;
}

interface LineChartProps {
  data: DataPoint[];
  color?: string;
  height?: number;
  formatValue?: (v: number) => string;
  unit?: string;
}

export function LineChart({
  data,
  color = '#2563eb',
  height = 200,
  formatValue = (v: number): string => String(v),
  unit = '',
}: LineChartProps): React.ReactElement {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const { points, pathD, areaD, yLabels } = useMemo(() => {
    if (data.length === 0) return { points: [], pathD: '', areaD: '', yLabels: [] };

    const values = data.map((d) => d.value);
    const max = Math.max(...values);
    const min = Math.min(...values, 0);
    const range = max - min || 1;

    const padTop = 20;
    const padBottom = 30;
    const padLeft = 50;
    const padRight = 20;
    const chartW = 600 - padLeft - padRight;
    const chartH = height - padTop - padBottom;

    const pts = data.map((d, i) => ({
      x: padLeft + (data.length > 1 ? (i / (data.length - 1)) * chartW : chartW / 2),
      y: padTop + chartH - ((d.value - min) / range) * chartH,
      ...d,
    }));

    const path = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ');
    const area = `${path} L${pts[pts.length - 1].x},${padTop + chartH} L${pts[0].x},${padTop + chartH} Z`;

    // Y축 라벨 (5단계)
    const steps = 4;
    const labels = Array.from({ length: steps + 1 }, (_, i) => {
      const val = min + (range / steps) * i;
      return {
        value: val,
        y: padTop + chartH - (i / steps) * chartH,
      };
    });

    return { points: pts, pathD: path, areaD: area, yLabels: labels };
  }, [data, height]);

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center rounded-lg border border-dashed border-gray-200 py-12 text-sm text-gray-400">
        데이터가 없습니다
      </div>
    );
  }

  return (
    <div className="relative">
      <svg viewBox={`0 0 600 ${height}`} className="w-full" preserveAspectRatio="xMidYMid meet">
        {/* 그리드 라인 */}
        {yLabels.map((l, i) => (
          <g key={i}>
            <line x1="50" y1={l.y} x2="580" y2={l.y} stroke="#e5e7eb" strokeWidth="1" />
            <text x="45" y={l.y + 4} textAnchor="end" fontSize="11" fill="#9ca3af">
              {formatValue(Math.round(l.value * 10) / 10)}
            </text>
          </g>
        ))}

        {/* 영역 */}
        <path d={areaD} fill={color} fillOpacity="0.08" />

        {/* 라인 */}
        <path d={pathD} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

        {/* 포인트 */}
        {points.map((p, i) => (
          <g key={i}>
            <circle
              cx={p.x}
              cy={p.y}
              r={hoveredIndex === i ? 5 : 3}
              fill={hoveredIndex === i ? color : 'white'}
              stroke={color}
              strokeWidth="2"
              className="cursor-pointer transition-all"
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
            />
            {/* X축 라벨 */}
            {(data.length <= 7 || i % Math.ceil(data.length / 7) === 0) && (
              <text x={p.x} y={height - 5} textAnchor="middle" fontSize="10" fill="#9ca3af">
                {p.label}
              </text>
            )}
          </g>
        ))}

        {/* 툴팁 */}
        {hoveredIndex !== null && (
          <g>
            <rect
              x={points[hoveredIndex].x - 40}
              y={points[hoveredIndex].y - 35}
              width="80"
              height="24"
              rx="4"
              fill="#1f2937"
            />
            <text
              x={points[hoveredIndex].x}
              y={points[hoveredIndex].y - 19}
              textAnchor="middle"
              fontSize="11"
              fill="white"
              fontWeight="600"
            >
              {formatValue(points[hoveredIndex].value)}{unit}
            </text>
          </g>
        )}
      </svg>
    </div>
  );
}
