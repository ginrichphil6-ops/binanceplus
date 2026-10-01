import React from 'react';

interface SparklineProps {
  data: number[];
  color: string;
  width?: number;
  height?: number;
  className?: string;
}

export const Sparkline: React.FC<SparklineProps> = ({
  data,
  color,
  width = 140,
  height = 42,
  className = '',
}) => {
  if (!data || data.length < 2) return null;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const padding = 3;

  const points = data.map((val, idx) => {
    const x = padding + (idx / (data.length - 1)) * (width - padding * 2);
    const y = height - padding - ((val - min) / range) * (height - padding * 2);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });

  const linePath = `M ${points.join(' L ')}`;
  const areaPath = `${linePath} L ${width - padding},${height} L ${padding},${height} Z`;

  const gradientId = `grad-${color.replace('#', '')}-${Math.random().toString(36).substring(2, 6)}`;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className={`w-full h-full overflow-visible ${className}`}
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0.0" />
        </linearGradient>
      </defs>

      {/* Area fill */}
      <path d={areaPath} fill={`url(#${gradientId})`} />

      {/* Curve line */}
      <path
        d={linePath}
        fill="none"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
