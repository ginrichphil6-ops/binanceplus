import React, { useState } from 'react';
import { useTrading } from '../../context/TradingContext';
import { formatPrice, formatAmount, formatTimeHHMMSS } from '../../utils/formatters';

export const MarketTrades: React.FC = () => {
  const { recentTrades, activePair, tradeHistory } = useTrading();
  const [tab, setTab] = useState<'MARKET' | 'MY'>('MARKET');

  const tradesToDisplay = tab === 'MARKET' ? recentTrades : tradeHistory;

  return (
    <div className="w-full h-full flex flex-col bg-[#181A20] select-none text-[11px] font-mono-numbers">
      {/* Top Tab Bar */}
      <div className="h-[36px] px-3 flex items-center gap-4 border-b border-[#2B313A] shrink-0 text-xs font-sans">
        <button
          onClick={() => setTab('MARKET')}
          className={`h-full relative font-medium transition-colors ${
            tab === 'MARKET' ? 'text-[#EAECEF]' : 'text-[#848E9C] hover:text-[#EAECEF]'
          }`}
        >
          Market Trades
          {tab === 'MARKET' && (
            <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#FCD535]" />
          )}
        </button>

        <button
          onClick={() => setTab('MY')}
          className={`h-full relative font-medium transition-colors ${
            tab === 'MY' ? 'text-[#EAECEF]' : 'text-[#848E9C] hover:text-[#EAECEF]'
          }`}
        >
          My Trades
          {tab === 'MY' && (
            <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#FCD535]" />
          )}
        </button>
      </div>

      {/* Column Headers */}
      <div className="px-3 py-1.5 grid grid-cols-3 text-[10px] text-[#848E9C] font-sans border-b border-[#2B313A]/50 shrink-0">
        <span className="text-left">Price({activePair.quote})</span>
        <span className="text-right">Size({activePair.base})</span>
        <span className="text-right">Time</span>
      </div>

      {/* Trades List */}
      <div className="flex-1 overflow-y-auto no-scrollbar py-1">
        {tradesToDisplay.length === 0 ? (
          <div className="h-32 flex items-center justify-center text-xs text-[#848E9C] font-sans">
            No trades executed yet
          </div>
        ) : (
          tradesToDisplay.map((trade) => {
            const isBuy = 'isBuyerMaker' in trade ? !trade.isBuyerMaker : trade.side === 'BUY';
            const price = trade.price;
            const amount = trade.amount;
            const time = 'time' in trade ? trade.time : trade.timestamp;

            return (
              <div
                key={trade.id}
                className="grid grid-cols-3 px-3 py-[2px] hover:bg-[#2B313A]/50 transition-colors"
              >
                <span className={`text-left font-medium ${isBuy ? 'text-[#0ECB81]' : 'text-[#F6465D]'}`}>
                  {formatPrice(price, activePair.precisionPrice)}
                </span>
                <span className="text-right text-[#EAECEF]">
                  {formatAmount(amount, activePair.precisionAmount)}
                </span>
                <span className="text-right text-[#848E9C]">
                  {formatTimeHHMMSS(time)}
                </span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
