import React, { useState, useEffect } from 'react';
import { useTrading } from '../../context/TradingContext';
import { CryptoIcon } from '../Icons/CryptoIcons';
import { formatPrice, formatVolume } from '../../utils/formatters';
import {
  Star,
  ChevronDown,
  ArrowUpRight,
  ArrowDownRight,
  LayoutGrid,
  Maximize2,
} from 'lucide-react';

export const TickerHeader: React.FC = () => {
  const {
    activePair,
    lastPrice,
    prevPrice,
    priceDirection,
    toggleFavoritePair,
    setActiveModal,
  } = useTrading();

  const [flashClass, setFlashClass] = useState<string>('');

  useEffect(() => {
    if (priceDirection === 'UP') {
      setFlashClass('flash-up');
    } else if (priceDirection === 'DOWN') {
      setFlashClass('flash-down');
    }
    const timeout = setTimeout(() => {
      setFlashClass('');
    }, 600);
    return () => clearTimeout(timeout);
  }, [lastPrice, priceDirection]);

  const isBullish = activePair.priceChangePercent >= 0;

  return (
    <div className="h-[52px] bg-[#181A20] border-b border-[#2B313A] px-4 flex items-center justify-between text-xs select-none shrink-0 overflow-x-auto no-scrollbar">
      {/* Left: Active Pair selector */}
      <div className="flex items-center gap-4 shrink-0">
        <div
          onClick={() => setActiveModal('MARKETS')}
          className="flex items-center gap-2 px-2.5 py-1.5 rounded hover:bg-[#2B313A] cursor-pointer transition-colors group"
        >
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              toggleFavoritePair(activePair.id);
            }}
            className="text-[#848E9C] hover:text-[#FCD535] transition-colors"
          >
            <Star
              size={14}
              className={activePair.isFavorite ? 'fill-[#FCD535] text-[#FCD535]' : ''}
            />
          </button>

          <CryptoIcon symbol={activePair.base} size={22} />

          <div className="flex items-center gap-1.5">
            <span className="font-bold text-sm text-[#EAECEF] tracking-tight group-hover:text-[#FCD535] transition-colors">
              {activePair.symbol}
            </span>
            <span className="px-1 py-0.2 rounded text-[10px] font-semibold bg-[#2B313A] text-[#848E9C]">
              10x
            </span>
            <ChevronDown size={14} className="text-[#848E9C] group-hover:text-[#EAECEF]" />
          </div>
        </div>

        {/* Divider */}
        <div className="h-5 w-[1px] bg-[#2B313A]" />

        {/* Last Price Block */}
        <div className="flex flex-col">
          <div className="flex items-center gap-1">
            <span
              className={`font-mono-numbers text-base font-bold transition-colors ${
                priceDirection === 'UP'
                  ? 'text-[#0ECB81]'
                  : priceDirection === 'DOWN'
                  ? 'text-[#F6465D]'
                  : 'text-[#EAECEF]'
              } ${flashClass}`}
            >
              {formatPrice(lastPrice, activePair.precisionPrice)}
            </span>
            {priceDirection === 'UP' ? (
              <ArrowUpRight size={14} className="text-[#0ECB81]" />
            ) : priceDirection === 'DOWN' ? (
              <ArrowDownRight size={14} className="text-[#F6465D]" />
            ) : null}
          </div>
          <span className="text-[10px] text-[#848E9C] font-mono-numbers">
            ≈ ${formatPrice(lastPrice, 2)}
          </span>
        </div>

        {/* 24h Change */}
        <div className="hidden sm:flex flex-col">
          <span className="text-[10px] text-[#848E9C]">24h Change</span>
          <span
            className={`font-mono-numbers font-medium text-[11px] ${
              isBullish ? 'text-[#0ECB81]' : 'text-[#F6465D]'
            }`}
          >
            {isBullish ? '+' : ''}
            {activePair.priceChange.toFixed(activePair.precisionPrice)} (
            {isBullish ? '+' : ''}
            {activePair.priceChangePercent.toFixed(2)}%)
          </span>
        </div>

        {/* 24h High */}
        <div className="hidden md:flex flex-col">
          <span className="text-[10px] text-[#848E9C]">24h High</span>
          <span className="font-mono-numbers text-[11px] text-[#EAECEF]">
            {formatPrice(activePair.high24h, activePair.precisionPrice)}
          </span>
        </div>

        {/* 24h Low */}
        <div className="hidden md:flex flex-col">
          <span className="text-[10px] text-[#848E9C]">24h Low</span>
          <span className="font-mono-numbers text-[11px] text-[#EAECEF]">
            {formatPrice(activePair.low24h, activePair.precisionPrice)}
          </span>
        </div>

        {/* 24h Volume (Base) */}
        <div className="hidden lg:flex flex-col">
          <span className="text-[10px] text-[#848E9C]">24h Volume({activePair.base})</span>
          <span className="font-mono-numbers text-[11px] text-[#EAECEF]">
            {formatVolume(activePair.volume24h)}
          </span>
        </div>

        {/* 24h Turnover (Quote) */}
        <div className="hidden xl:flex flex-col">
          <span className="text-[10px] text-[#848E9C]">24h Turnover({activePair.quote})</span>
          <span className="font-mono-numbers text-[11px] text-[#EAECEF]">
            {formatVolume(activePair.turnover24h)}
          </span>
        </div>
      </div>

      {/* Right: Layout Switcher & Fullscreen shortcuts */}
      <div className="flex items-center gap-1 shrink-0">
        <button
          onClick={() => setActiveModal('MARKETS')}
          className="flex items-center gap-1 px-2 py-1 rounded text-[#848E9C] hover:text-[#EAECEF] hover:bg-[#2B313A] transition-colors"
          title="Browse All Pairs"
        >
          <span className="text-[11px]">Markets</span>
        </button>

        <button
          className="p-1.5 rounded text-[#848E9C] hover:text-[#EAECEF] hover:bg-[#2B313A] transition-colors"
          title="Standard Pro Layout"
        >
          <LayoutGrid size={14} />
        </button>

        <button
          onClick={() => {
            if (!document.fullscreenElement) {
              document.documentElement.requestFullscreen().catch(() => {});
            } else {
              document.exitFullscreen().catch(() => {});
            }
          }}
          className="p-1.5 rounded text-[#848E9C] hover:text-[#EAECEF] hover:bg-[#2B313A] transition-colors"
          title="Toggle Fullscreen"
        >
          <Maximize2 size={14} />
        </button>
      </div>
    </div>
  );
};
