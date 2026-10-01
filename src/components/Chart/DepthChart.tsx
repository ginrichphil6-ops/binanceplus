import React, { useMemo } from 'react';
import { useTrading } from '../../context/TradingContext';
import { formatPrice, formatAmount } from '../../utils/formatters';

export const DepthChart: React.FC = () => {
  const { orderBook, lastPrice, activePair } = useTrading();

  const { bidPoints, askPoints, maxCum } = useMemo(() => {
    const bids = [...orderBook.bids].slice(0, 16);
    const asks = [...orderBook.asks].slice(0, 16);

    const maxBidCum = bids[bids.length - 1]?.cumulative || 1;
    const maxAskCum = asks[asks.length - 1]?.cumulative || 1;
    const max = Math.max(maxBidCum, maxAskCum);

    return {
      bidPoints: bids,
      askPoints: asks,
      maxCum: max,
    };
  }, [orderBook]);

  const width = 800;
  const height = 360;
  const halfWidth = width / 2;

  // Generate SVG path for bids (left half, green)
  const bidsPath = useMemo(() => {
    if (!bidPoints.length) return '';
    let d = `M 0,${height} `;
    bidPoints.forEach((b, idx) => {
      const x = (idx / (bidPoints.length - 1)) * halfWidth;
      const y = height - (b.cumulative / maxCum) * (height - 40);
      d += `L ${x},${y} `;
    });
    d += `L ${halfWidth},${height} Z`;
    return d;
  }, [bidPoints, maxCum, halfWidth, height]);

  // Generate SVG path for asks (right half, red)
  const asksPath = useMemo(() => {
    if (!askPoints.length) return '';
    let d = `M ${halfWidth},${height} `;
    askPoints.forEach((a, idx) => {
      const x = halfWidth + (idx / (askPoints.length - 1)) * halfWidth;
      const y = height - (a.cumulative / maxCum) * (height - 40);
      d += `L ${x},${y} `;
    });
    d += `L ${width},${height} Z`;
    return d;
  }, [askPoints, maxCum, halfWidth, height, width]);

  return (
    <div className="w-full h-full relative bg-[#181A20] flex flex-col select-none p-2">
      {/* Legend & Mid-price */}
      <div className="flex items-center justify-between text-[11px] text-[#848E9C] px-3 py-1 border-b border-[#2B313A]">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-[#0ECB81]">
            <span className="w-2.5 h-2.5 bg-[#0ECB81]/40 border border-[#0ECB81] rounded-xs" />
            Buy Orders (Bids)
          </span>
          <span className="flex items-center gap-1.5 text-[#F6465D]">
            <span className="w-2.5 h-2.5 bg-[#F6465D]/40 border border-[#F6465D] rounded-xs" />
            Sell Orders (Asks)
          </span>
        </div>
        <div className="font-mono-numbers">
          Mid Price: <span className="text-[#EAECEF] font-bold">${formatPrice(lastPrice, activePair.precisionPrice)}</span>
        </div>
      </div>

      {/* SVG Canvas */}
      <div className="flex-1 w-full relative overflow-hidden flex items-center justify-center">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-full preserve-3d"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="bidGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0ECB81" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#0ECB81" stopOpacity="0.05" />
            </linearGradient>
            <linearGradient id="askGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#F6465D" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#F6465D" stopOpacity="0.05" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          <line x1={0} y1={height * 0.25} x2={width} y2={height * 0.25} stroke="#2B313A" strokeDasharray="3 3" />
          <line x1={0} y1={height * 0.5} x2={width} y2={height * 0.5} stroke="#2B313A" strokeDasharray="3 3" />
          <line x1={0} y1={height * 0.75} x2={width} y2={height * 0.75} stroke="#2B313A" strokeDasharray="3 3" />
          <line x1={halfWidth} y1={0} x2={halfWidth} y2={height} stroke="#474D57" strokeWidth="1" strokeDasharray="4 2" />

          {/* Bid Area */}
          <path d={bidsPath} fill="url(#bidGrad)" stroke="#0ECB81" strokeWidth="2" />

          {/* Ask Area */}
          <path d={asksPath} fill="url(#askGrad)" stroke="#F6465D" strokeWidth="2" />
        </svg>

        {/* Labels along bottom */}
        <div className="absolute bottom-2 left-4 text-[10px] text-[#0ECB81] font-mono-numbers">
          ${formatPrice(bidPoints[bidPoints.length - 1]?.price || lastPrice * 0.98, activePair.precisionPrice)}
        </div>
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[10px] text-[#EAECEF] font-mono-numbers bg-[#1E2329] px-2 py-0.5 rounded border border-[#2B313A]">
          ${formatPrice(lastPrice, activePair.precisionPrice)}
        </div>
        <div className="absolute bottom-2 right-4 text-[10px] text-[#F6465D] font-mono-numbers">
          ${formatPrice(askPoints[askPoints.length - 1]?.price || lastPrice * 1.02, activePair.precisionPrice)}
        </div>
      </div>
    </div>
  );
};
