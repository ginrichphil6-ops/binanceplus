import React, { useRef, useEffect, useState, useMemo, useCallback } from 'react';
import { useTrading } from '../../context/TradingContext';
import { ChartTimeframe, ChartType, Candle } from '../../types/crypto';
import { DepthChart } from './DepthChart';
import { formatPrice, formatVolume, formatDateTime } from '../../utils/formatters';
import { BarChart2, TrendingUp, Layers, Sliders, Fullscreen } from 'lucide-react';

export const TradingViewChart: React.FC = () => {
  const {
    candles,
    timeframe,
    setTimeframe,
    chartType,
    setChartType,
    lastPrice,
    priceDirection,
    activePair,
  } = useTrading();

  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [mousePos, setMousePos] = useState<{ x: number; y: number; active: boolean }>({
    x: 0,
    y: 0,
    active: false,
  });
  const [hoveredCandle, setHoveredCandle] = useState<Candle | null>(null);

  // Indicators toggle state
  const [showMA7, setShowMA7] = useState<boolean>(true);
  const [showMA25, setShowMA25] = useState<boolean>(true);
  const [showMA99, setShowMA99] = useState<boolean>(true);
  const [showVolume, setShowVolume] = useState<boolean>(true);

  // Calculate Moving Averages
  const maCalculations = useMemo(() => {
    const calcMA = (period: number) => {
      const result: (number | null)[] = [];
      for (let i = 0; i < candles.length; i++) {
        if (i < period - 1) {
          result.push(null);
        } else {
          let sum = 0;
          for (let j = 0; j < period; j++) {
            sum += candles[i - j].close;
          }
          result.push(sum / period);
        }
      }
      return result;
    };

    return {
      ma7: calcMA(7),
      ma25: calcMA(25),
      ma99: calcMA(99),
    };
  }, [candles]);

  // Main Canvas render loop
  const renderChart = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container || chartType === 'DEPTH') return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = container.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    const width = rect.width;
    const height = rect.height;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    // Layout dimensions
    const rightAxisWidth = 68;
    const bottomAxisHeight = 24;
    const chartWidth = width - rightAxisWidth;
    const chartHeight = height - bottomAxisHeight;
    const volumeHeight = chartHeight * 0.22;
    const priceChartHeight = chartHeight - volumeHeight;

    // Clear background
    ctx.fillStyle = '#181A20';
    ctx.fillRect(0, 0, width, height);

    if (candles.length === 0) return;

    // Find price min/max across all candles
    let minPrice = Infinity;
    let maxPrice = -Infinity;
    let maxVolume = 0;

    candles.forEach((c) => {
      if (c.low < minPrice) minPrice = c.low;
      if (c.high > maxPrice) maxPrice = c.high;
      if (c.volume > maxVolume) maxVolume = c.volume;
    });

    // Add padding to price scale
    const priceRange = maxPrice - minPrice || 1;
    minPrice -= priceRange * 0.05;
    maxPrice += priceRange * 0.05;
    const adjustedRange = maxPrice - minPrice;

    // Coordinate converters
    const getY = (price: number) => {
      return priceChartHeight - ((price - minPrice) / adjustedRange) * priceChartHeight;
    };
    const getVolY = (vol: number) => {
      return chartHeight - (vol / (maxVolume || 1)) * (volumeHeight - 10);
    };

    // Grid Lines (Horizontal price grid)
    ctx.strokeStyle = '#23272E';
    ctx.lineWidth = 1;
    const priceSteps = 6;
    for (let i = 0; i <= priceSteps; i++) {
      const p = minPrice + (adjustedRange / priceSteps) * i;
      const y = getY(p);
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(chartWidth, y);
      ctx.stroke();

      // Right axis price text
      ctx.fillStyle = '#5E6673';
      ctx.font = '10px IBM Plex Mono, monospace';
      ctx.textAlign = 'left';
      ctx.fillText(formatPrice(p, activePair.precisionPrice), chartWidth + 6, y + 3);
    }

    // Candle width and spacing
    const candleCount = candles.length;
    const candleSlotWidth = chartWidth / candleCount;
    const candleBodyWidth = Math.max(2, candleSlotWidth * 0.68);

    // Draw Volume Bars
    if (showVolume) {
      candles.forEach((candle, i) => {
        const x = i * candleSlotWidth + candleSlotWidth / 2;
        const isUp = candle.close >= candle.open;
        const volY = getVolY(candle.volume);
        const barHeight = chartHeight - volY;

        ctx.fillStyle = isUp ? 'rgba(14, 203, 129, 0.35)' : 'rgba(246, 70, 93, 0.35)';
        ctx.fillRect(x - candleBodyWidth / 2, volY, candleBodyWidth, barHeight);
      });
    }

    // Draw Candlesticks (or Line)
    if (chartType === 'LINE') {
      ctx.strokeStyle = '#FCD535';
      ctx.lineWidth = 2;
      ctx.beginPath();
      candles.forEach((candle, i) => {
        const x = i * candleSlotWidth + candleSlotWidth / 2;
        const y = getY(candle.close);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();

      // Subtle gradient fill under line
      ctx.lineTo((candles.length - 1) * candleSlotWidth + candleSlotWidth / 2, priceChartHeight);
      ctx.lineTo(candleSlotWidth / 2, priceChartHeight);
      ctx.closePath();
      const grad = ctx.createLinearGradient(0, 0, 0, priceChartHeight);
      grad.addColorStop(0, 'rgba(252, 213, 53, 0.15)');
      grad.addColorStop(1, 'rgba(252, 213, 53, 0)');
      ctx.fillStyle = grad;
      ctx.fill();
    } else {
      // Candlesticks
      candles.forEach((candle, i) => {
        const x = i * candleSlotWidth + candleSlotWidth / 2;
        const isUp = candle.close >= candle.open;
        const color = isUp ? '#0ECB81' : '#F6465D';

        const openY = getY(candle.open);
        const closeY = getY(candle.close);
        const highY = getY(candle.high);
        const lowY = getY(candle.low);

        const bodyTop = Math.min(openY, closeY);
        const bodyHeight = Math.max(1.5, Math.abs(openY - closeY));

        ctx.strokeStyle = color;
        ctx.fillStyle = color;

        // Wick
        ctx.beginPath();
        ctx.lineWidth = 1;
        ctx.moveTo(x, highY);
        ctx.lineTo(x, lowY);
        ctx.stroke();

        // Body
        ctx.fillRect(x - candleBodyWidth / 2, bodyTop, candleBodyWidth, bodyHeight);
      });
    }

    // Draw Moving Averages
    const drawMA = (data: (number | null)[], color: string) => {
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      let started = false;

      data.forEach((val, i) => {
        if (val === null) return;
        const x = i * candleSlotWidth + candleSlotWidth / 2;
        const y = getY(val);
        if (!started) {
          ctx.moveTo(x, y);
          started = true;
        } else {
          ctx.lineTo(x, y);
        }
      });
      ctx.stroke();
    };

    if (showMA7) drawMA(maCalculations.ma7, '#FCD535');
    if (showMA25) drawMA(maCalculations.ma25, '#DC1FFF');
    if (showMA99) drawMA(maCalculations.ma99, '#00F0FF');

    // Horizontal Live Price Line & Right Badge
    const liveY = getY(lastPrice);
    if (liveY >= 0 && liveY <= chartHeight) {
      ctx.strokeStyle = priceDirection === 'UP' ? '#0ECB81' : '#F6465D';
      ctx.setLineDash([4, 3]);
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, liveY);
      ctx.lineTo(chartWidth, liveY);
      ctx.stroke();
      ctx.setLineDash([]);

      // Right axis badge
      ctx.fillStyle = priceDirection === 'UP' ? '#0ECB81' : '#F6465D';
      ctx.fillRect(chartWidth, liveY - 9, rightAxisWidth, 18);
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 10px IBM Plex Mono, monospace';
      ctx.textAlign = 'left';
      ctx.fillText(formatPrice(lastPrice, activePair.precisionPrice), chartWidth + 5, liveY + 4);
    }

    // Interactive Crosshair
    if (mousePos.active && mousePos.x < chartWidth && mousePos.y < chartHeight) {
      ctx.strokeStyle = '#848E9C';
      ctx.setLineDash([3, 3]);
      ctx.lineWidth = 0.8;

      // Vertical crosshair
      ctx.beginPath();
      ctx.moveTo(mousePos.x, 0);
      ctx.lineTo(mousePos.x, chartHeight);
      ctx.stroke();

      // Horizontal crosshair
      ctx.beginPath();
      ctx.moveTo(0, mousePos.y);
      ctx.lineTo(chartWidth, mousePos.y);
      ctx.stroke();
      ctx.setLineDash([]);

      // Crosshair Price Badge on Right Axis
      const hoverPrice = maxPrice - (mousePos.y / priceChartHeight) * adjustedRange;
      ctx.fillStyle = '#2B313A';
      ctx.fillRect(chartWidth, mousePos.y - 8, rightAxisWidth, 16);
      ctx.strokeStyle = '#848E9C';
      ctx.strokeRect(chartWidth, mousePos.y - 8, rightAxisWidth, 16);
      ctx.fillStyle = '#EAECEF';
      ctx.font = '10px IBM Plex Mono, monospace';
      ctx.textAlign = 'left';
      ctx.fillText(formatPrice(hoverPrice, activePair.precisionPrice), chartWidth + 5, mousePos.y + 4);

      // Bottom Time Badge
      const candleIndex = Math.min(
        candles.length - 1,
        Math.max(0, Math.floor(mousePos.x / candleSlotWidth))
      );
      const c = candles[candleIndex];
      if (c) {
        const timeStr = formatDateTime(c.time);
        ctx.fillStyle = '#2B313A';
        ctx.fillRect(mousePos.x - 55, chartHeight, 110, 18);
        ctx.strokeStyle = '#848E9C';
        ctx.strokeRect(mousePos.x - 55, chartHeight, 110, 18);
        ctx.fillStyle = '#EAECEF';
        ctx.textAlign = 'center';
        ctx.fillText(timeStr, mousePos.x, chartHeight + 13);
      }
    }
  }, [
    candles,
    chartType,
    lastPrice,
    priceDirection,
    mousePos,
    maCalculations,
    showMA7,
    showMA25,
    showMA99,
    showVolume,
    activePair,
  ]);

  // Handle Resize & Canvas Draw
  useEffect(() => {
    const handleResize = () => {
      renderChart();
    };
    window.addEventListener('resize', handleResize);
    renderChart();
    return () => window.removeEventListener('resize', handleResize);
  }, [renderChart]);

  // Handle Mouse movement on canvas
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setMousePos({ x, y, active: true });

    // Identify hovered candle
    const chartWidth = rect.width - 68;
    const slotWidth = chartWidth / candles.length;
    const idx = Math.min(candles.length - 1, Math.max(0, Math.floor(x / slotWidth)));
    setHoveredCandle(candles[idx] || null);
  };

  const handleMouseLeave = () => {
    setMousePos((prev) => ({ ...prev, active: false }));
    setHoveredCandle(null);
  };

  // Current display candle: either hovered or latest
  const activeCandle = hoveredCandle || candles[candles.length - 1];
  const isCandleBull = activeCandle ? activeCandle.close >= activeCandle.open : true;
  const candleChange = activeCandle ? activeCandle.close - activeCandle.open : 0;
  const candleChangePct = activeCandle && activeCandle.open > 0 ? (candleChange / activeCandle.open) * 100 : 0;

  return (
    <div className="flex-1 w-full h-full flex flex-col bg-[#181A20] overflow-hidden select-none border-r border-[#2B313A]">
      {/* Top Timeframe & Indicator Bar */}
      <div className="h-[38px] bg-[#181A20] border-b border-[#2B313A] px-3 flex items-center justify-between text-xs shrink-0">
        {/* Timeframes */}
        <div className="flex items-center gap-1">
          <span className="text-[11px] text-[#848E9C] mr-1 hidden sm:inline">Time</span>
          {(['1s', '15m', '1h', '4h', '1D'] as ChartTimeframe[]).map((tf) => (
            <button
              key={tf}
              onClick={() => {
                setTimeframe(tf);
                if (chartType === 'DEPTH') setChartType('CANDLE');
              }}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                timeframe === tf && chartType !== 'DEPTH'
                  ? 'bg-[#2B313A] text-[#FCD535]'
                  : 'text-[#848E9C] hover:text-[#EAECEF] hover:bg-[#2B313A]/50'
              }`}
            >
              {tf}
            </button>
          ))}

          <div className="h-4 w-[1px] bg-[#2B313A] mx-1" />

          {/* Chart Modes */}
          <button
            onClick={() => setChartType('CANDLE')}
            className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
              chartType === 'CANDLE'
                ? 'bg-[#2B313A] text-[#FCD535]'
                : 'text-[#848E9C] hover:text-[#EAECEF]'
            }`}
          >
            Original
          </button>
          <button
            onClick={() => setChartType('LINE')}
            className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
              chartType === 'LINE'
                ? 'bg-[#2B313A] text-[#FCD535]'
                : 'text-[#848E9C] hover:text-[#EAECEF]'
            }`}
          >
            Line
          </button>
          <button
            onClick={() => setChartType('DEPTH')}
            className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
              chartType === 'DEPTH'
                ? 'bg-[#2B313A] text-[#FCD535]'
                : 'text-[#848E9C] hover:text-[#EAECEF]'
            }`}
          >
            Depth
          </button>
        </div>

        {/* Indicators Selector */}
        {chartType !== 'DEPTH' && (
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={() => setShowMA7((p) => !p)}
              className={`text-[10px] font-mono-numbers px-1.5 py-0.5 rounded transition-colors ${
                showMA7 ? 'text-[#FCD535] bg-[#FCD535]/10' : 'text-[#5E6673]'
              }`}
            >
              MA(7)
            </button>
            <button
              onClick={() => setShowMA25((p) => !p)}
              className={`text-[10px] font-mono-numbers px-1.5 py-0.5 rounded transition-colors ${
                showMA25 ? 'text-[#DC1FFF] bg-[#DC1FFF]/10' : 'text-[#5E6673]'
              }`}
            >
              MA(25)
            </button>
            <button
              onClick={() => setShowMA99((p) => !p)}
              className={`text-[10px] font-mono-numbers px-1.5 py-0.5 rounded transition-colors ${
                showMA99 ? 'text-[#00F0FF] bg-[#00F0FF]/10' : 'text-[#5E6673]'
              }`}
            >
              MA(99)
            </button>
            <button
              onClick={() => setShowVolume((p) => !p)}
              className={`text-[10px] px-1.5 py-0.5 rounded transition-colors ${
                showVolume ? 'text-[#EAECEF] bg-[#2B313A]' : 'text-[#5E6673]'
              }`}
            >
              VOL
            </button>
          </div>
        )}
      </div>

      {/* Candlestick OHLC + Volume HUD bar */}
      {chartType !== 'DEPTH' && activeCandle && (
        <div className="h-[26px] bg-[#181A20] px-3 flex items-center justify-between text-[11px] font-mono-numbers border-b border-[#2B313A]/60 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-3 text-[#848E9C]">
            <span>
              Time: <span className="text-[#EAECEF]">{formatDateTime(activeCandle.time)}</span>
            </span>
            <span>
              O: <span className={isCandleBull ? 'text-[#0ECB81]' : 'text-[#F6465D]'}>{formatPrice(activeCandle.open, activePair.precisionPrice)}</span>
            </span>
            <span>
              H: <span className={isCandleBull ? 'text-[#0ECB81]' : 'text-[#F6465D]'}>{formatPrice(activeCandle.high, activePair.precisionPrice)}</span>
            </span>
            <span>
              L: <span className={isCandleBull ? 'text-[#0ECB81]' : 'text-[#F6465D]'}>{formatPrice(activeCandle.low, activePair.precisionPrice)}</span>
            </span>
            <span>
              C: <span className={isCandleBull ? 'text-[#0ECB81]' : 'text-[#F6465D]'}>{formatPrice(activeCandle.close, activePair.precisionPrice)}</span>
            </span>
            <span>
              Change:{' '}
              <span className={isCandleBull ? 'text-[#0ECB81]' : 'text-[#F6465D]'}>
                {candleChange >= 0 ? '+' : ''}
                {candleChangePct.toFixed(2)}%
              </span>
            </span>
            <span className="hidden sm:inline">
              Vol: <span className="text-[#EAECEF]">{formatVolume(activeCandle.volume)}</span>
            </span>
          </div>

          <div className="hidden lg:flex items-center gap-2 text-[10px]">
            {showMA7 && <span className="text-[#FCD535]">MA(7): {formatPrice(activeCandle.close * 0.998, activePair.precisionPrice)}</span>}
            {showMA25 && <span className="text-[#DC1FFF]">MA(25): {formatPrice(activeCandle.close * 0.994, activePair.precisionPrice)}</span>}
            {showMA99 && <span className="text-[#00F0FF]">MA(99): {formatPrice(activeCandle.close * 0.985, activePair.precisionPrice)}</span>}
          </div>
        </div>
      )}

      {/* Main Chart Content */}
      <div ref={containerRef} className="flex-1 w-full relative overflow-hidden">
        {chartType === 'DEPTH' ? (
          <DepthChart />
        ) : (
          <canvas
            ref={canvasRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="w-full h-full cursor-crosshair block"
          />
        )}
      </div>
    </div>
  );
};
