import React, { useMemo } from 'react';
import { useTrading } from '../../context/TradingContext';
import { formatPrice, formatAmount } from '../../utils/formatters';
import { ArrowUp, ArrowDown, ChevronDown } from 'lucide-react';

export const OrderBook: React.FC = () => {
  const {
    orderBook,
    lastPrice,
    prevPrice,
    priceDirection,
    activePair,
    bookMode,
    setBookMode,
    precisionGrouping,
    setPrecisionGrouping,
    setSelectedPriceInput,
  } = useTrading();

  // Limit rows based on view mode
  const { visibleAsks, visibleBids } = useMemo(() => {
    if (bookMode === 'ASKS') {
      return {
        visibleAsks: orderBook.asks.slice(-22),
        visibleBids: [],
      };
    }
    if (bookMode === 'BIDS') {
      return {
        visibleAsks: [],
        visibleBids: orderBook.bids.slice(0, 22),
      };
    }
    // Combined mode: 11 asks and 11 bids
    return {
      visibleAsks: orderBook.asks.slice(-11),
      visibleBids: orderBook.bids.slice(0, 11),
    };
  }, [orderBook, bookMode]);

  // Spread calculation
  const topAsk = orderBook.asks[orderBook.asks.length - 1]?.price || lastPrice;
  const topBid = orderBook.bids[0]?.price || lastPrice;
  const spread = Math.max(0, topAsk - topBid);
  const spreadPercent = topBid > 0 ? (spread / topBid) * 100 : 0;

  return (
    <div className="w-full h-full flex flex-col bg-[#181A20] select-none text-[11px] font-mono-numbers">
      {/* Top Header: View mode & Precision */}
      <div className="h-[36px] px-3 flex items-center justify-between border-b border-[#2B313A] shrink-0 text-xs">
        {/* Book View Mode Icons */}
        <div className="flex items-center gap-1">
          {/* Default / Combined */}
          <button
            onClick={() => setBookMode('BOTH')}
            title="Asks and Bids"
            className={`p-1 rounded transition-colors ${
              bookMode === 'BOTH' ? 'bg-[#2B313A] text-[#FCD535]' : 'text-[#848E9C] hover:text-[#EAECEF]'
            }`}
          >
            <div className="flex flex-col gap-[2px] w-3.5">
              <span className="h-[3px] bg-[#F6465D] rounded-[1px]" />
              <span className="h-[3px] bg-[#0ECB81] rounded-[1px]" />
            </div>
          </button>

          {/* Bids only */}
          <button
            onClick={() => setBookMode('BIDS')}
            title="Bids Only"
            className={`p-1 rounded transition-colors ${
              bookMode === 'BIDS' ? 'bg-[#2B313A] text-[#FCD535]' : 'text-[#848E9C] hover:text-[#EAECEF]'
            }`}
          >
            <div className="flex flex-col gap-[2px] w-3.5">
              <span className="h-[3px] bg-[#0ECB81] rounded-[1px]" />
              <span className="h-[3px] bg-[#0ECB81] rounded-[1px]" />
            </div>
          </button>

          {/* Asks only */}
          <button
            onClick={() => setBookMode('ASKS')}
            title="Asks Only"
            className={`p-1 rounded transition-colors ${
              bookMode === 'ASKS' ? 'bg-[#2B313A] text-[#FCD535]' : 'text-[#848E9C] hover:text-[#EAECEF]'
            }`}
          >
            <div className="flex flex-col gap-[2px] w-3.5">
              <span className="h-[3px] bg-[#F6465D] rounded-[1px]" />
              <span className="h-[3px] bg-[#F6465D] rounded-[1px]" />
            </div>
          </button>
        </div>

        {/* Precision Grouping Selector */}
        <div className="flex items-center gap-1 text-[#848E9C]">
          <select
            value={precisionGrouping}
            onChange={(e) => setPrecisionGrouping(Number(e.target.value))}
            className="bg-[#1E2329] border border-[#2B313A] text-[#EAECEF] rounded px-1.5 py-0.5 text-[10px] focus:outline-none focus:border-[#474D57] cursor-pointer"
          >
            {activePair.lastPrice < 1 ? (
              <>
                <option value={8}>0.00000001</option>
                <option value={6}>0.000001</option>
                <option value={4}>0.0001</option>
              </>
            ) : (
              <>
                <option value={2}>0.01</option>
                <option value={1}>0.1</option>
                <option value={0}>1</option>
                <option value={-1}>10</option>
              </>
            )}
          </select>
        </div>
      </div>

      {/* Table Column Headers */}
      <div className="px-3 py-1.5 grid grid-cols-3 text-[10px] text-[#848E9C] font-sans border-b border-[#2B313A]/50 shrink-0">
        <span className="text-left">Price({activePair.quote})</span>
        <span className="text-right">Size({activePair.base})</span>
        <span className="text-right">Total</span>
      </div>

      {/* Order Book Rows Content */}
      <div className="flex-1 overflow-hidden flex flex-col justify-between">
        {/* Asks (Sell Orders - Red) */}
        {visibleAsks.length > 0 && (
          <div className="flex flex-col justify-end overflow-hidden flex-1">
            {visibleAsks.map((row, idx) => (
              <div
                key={`ask-${idx}-${row.price}`}
                onClick={() => setSelectedPriceInput(row.price)}
                className="relative grid grid-cols-3 px-3 py-[2px] cursor-pointer hover:bg-[#2B313A]/60 transition-colors group"
              >
                {/* Horizontal Depth Fill Bar */}
                <div
                  className="absolute right-0 top-0 bottom-0 bg-[#F6465D]/15 pointer-events-none transition-all duration-300"
                  style={{ width: `${row.depthPercent}%` }}
                />

                <span className="text-left text-[#F6465D] font-medium relative z-10">
                  {formatPrice(row.price, activePair.precisionPrice)}
                </span>
                <span className="text-right text-[#EAECEF] relative z-10">
                  {formatAmount(row.amount, activePair.precisionAmount)}
                </span>
                <span className="text-right text-[#848E9C] relative z-10 group-hover:text-[#EAECEF]">
                  {formatAmount(row.cumulative, activePair.precisionAmount)}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Middle Spread & Current Price Bar */}
        <div className="h-[36px] bg-[#1E2329]/80 border-y border-[#2B313A] px-3 flex items-center justify-between shrink-0 my-0.5">
          <div className="flex items-center gap-2">
            <span
              className={`text-sm font-bold flex items-center gap-1 ${
                priceDirection === 'UP'
                  ? 'text-[#0ECB81]'
                  : priceDirection === 'DOWN'
                  ? 'text-[#F6465D]'
                  : 'text-[#EAECEF]'
              }`}
            >
              {formatPrice(lastPrice, activePair.precisionPrice)}
              {priceDirection === 'UP' ? (
                <ArrowUp size={13} className="text-[#0ECB81]" />
              ) : priceDirection === 'DOWN' ? (
                <ArrowDown size={13} className="text-[#F6465D]" />
              ) : null}
            </span>
            <span className="text-[10px] text-[#848E9C]">
              ${formatPrice(lastPrice, 2)}
            </span>
          </div>

          <div className="text-[10px] text-[#848E9C] font-sans">
            Spread <span className="text-[#EAECEF] font-mono-numbers">{formatPrice(spread, activePair.precisionPrice)}</span> ({spreadPercent.toFixed(2)}%)
          </div>
        </div>

        {/* Bids (Buy Orders - Green) */}
        {visibleBids.length > 0 && (
          <div className="flex flex-col justify-start overflow-hidden flex-1">
            {visibleBids.map((row, idx) => (
              <div
                key={`bid-${idx}-${row.price}`}
                onClick={() => setSelectedPriceInput(row.price)}
                className="relative grid grid-cols-3 px-3 py-[2px] cursor-pointer hover:bg-[#2B313A]/60 transition-colors group"
              >
                {/* Horizontal Depth Fill Bar */}
                <div
                  className="absolute right-0 top-0 bottom-0 bg-[#0ECB81]/15 pointer-events-none transition-all duration-300"
                  style={{ width: `${row.depthPercent}%` }}
                />

                <span className="text-left text-[#0ECB81] font-medium relative z-10">
                  {formatPrice(row.price, activePair.precisionPrice)}
                </span>
                <span className="text-right text-[#EAECEF] relative z-10">
                  {formatAmount(row.amount, activePair.precisionAmount)}
                </span>
                <span className="text-right text-[#848E9C] relative z-10 group-hover:text-[#EAECEF]">
                  {formatAmount(row.cumulative, activePair.precisionAmount)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
