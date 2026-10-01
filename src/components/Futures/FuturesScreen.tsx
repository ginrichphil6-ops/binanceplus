import React, { useState } from 'react';
import { useTrading } from '../../context/TradingContext';
import { formatPrice } from '../../utils/formatters';
import { ChevronDown, SlidersHorizontal, AlertCircle, CheckCircle2 } from 'lucide-react';

export const FuturesScreen: React.FC = () => {
  const { activePair, lastPrice, assets, depositDemoFunds } = useTrading();
  const [leverage, setLeverage] = useState(20);
  const [marginType, setMarginType] = useState<'Cross' | 'Isolated'>('Cross');
  const [side, setSide] = useState<'LONG' | 'SHORT'>('LONG');
  const [price, setPrice] = useState(lastPrice.toString());
  const [amount, setAmount] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);

  const usdtAsset = assets.find((a) => a.coin === 'USDT');
  const available = usdtAsset ? usdtAsset.available : 0;

  const handleOpenPosition = () => {
    const amt = parseFloat(amount);
    if (isNaN(amt) || amt <= 0) {
      setFeedback('Please enter a valid position amount');
      setTimeout(() => setFeedback(null), 3000);
      return;
    }
    const cost = (parseFloat(price) || lastPrice) * amt / leverage;
    if (cost > available) {
      setFeedback(`Insufficient margin. Required: $${cost.toFixed(2)}`);
      setTimeout(() => setFeedback(null), 3000);
      return;
    }

    setFeedback(`Futures ${leverage}x ${side} position of ${amt} ${activePair.base} opened!`);
    setAmount('');
    setTimeout(() => setFeedback(null), 4000);
  };

  return (
    <div className="flex-1 w-full bg-[#181A20] text-[#EAECEF] overflow-y-auto no-scrollbar pb-20 select-none">
      <div className="w-full max-w-md mx-auto px-4 pt-3 flex flex-col gap-3 text-xs">
        {/* Contract Header */}
        <div className="flex items-center justify-between pb-2 border-b border-[#2B313A]">
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm text-[#EAECEF]">{activePair.base}USDT Perpetual</span>
            <span className="text-[10px] text-[#0ECB81] bg-[#0ECB81]/15 px-1.5 py-0.5 rounded font-mono-numbers">
              +{activePair.priceChangePercent.toFixed(2)}%
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setMarginType(marginType === 'Cross' ? 'Isolated' : 'Cross')}
              className="bg-[#2B313A] px-2 py-0.5 rounded text-[11px] font-medium"
            >
              {marginType}
            </button>
            <button
              onClick={() => setLeverage(leverage === 20 ? 50 : leverage === 50 ? 100 : 20)}
              className="bg-[#2B313A] text-[#FCD535] px-2 py-0.5 rounded text-[11px] font-bold"
            >
              {leverage}x
            </button>
          </div>
        </div>

        {/* Feedback message */}
        {feedback && (
          <div className="p-2.5 rounded bg-[#FCD535]/15 border border-[#FCD535]/30 text-[#FCD535] text-xs">
            {feedback}
          </div>
        )}

        {/* Long / Short Switcher */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => setSide('LONG')}
            className={`py-2 rounded-lg font-bold text-xs transition-colors ${
              side === 'LONG' ? 'bg-[#0ECB81] text-white' : 'bg-[#2B313A] text-[#848E9C]'
            }`}
          >
            Open Long
          </button>
          <button
            onClick={() => setSide('SHORT')}
            className={`py-2 rounded-lg font-bold text-xs transition-colors ${
              side === 'SHORT' ? 'bg-[#F6465D] text-white' : 'bg-[#2B313A] text-[#848E9C]'
            }`}
          >
            Open Short
          </button>
        </div>

        {/* Inputs */}
        <div className="bg-[#1E2329] border border-[#2B313A] rounded-xl p-3.5 flex flex-col gap-3">
          <div className="flex items-center justify-between text-[#848E9C]">
            <span>Avbl Margin</span>
            <span className="font-mono-numbers text-[#EAECEF]">${formatPrice(available, 2)} USDT</span>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-[#848E9C] text-[11px]">Entry Price</span>
            <div className="bg-[#181A20] border border-[#2B313A] rounded-lg px-3 py-2 flex items-center justify-between">
              <input
                type="text"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="bg-transparent text-xs font-mono-numbers text-[#EAECEF] focus:outline-none w-full"
              />
              <span className="text-[#848E9C] font-mono-numbers ml-2">USDT</span>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-[#848E9C] text-[11px]">Amount</span>
            <div className="bg-[#181A20] border border-[#2B313A] rounded-lg px-3 py-2 flex items-center justify-between">
              <input
                type="text"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="bg-transparent text-xs font-mono-numbers text-[#EAECEF] focus:outline-none w-full"
              />
              <span className="text-[#848E9C] font-mono-numbers ml-2">{activePair.base}</span>
            </div>
          </div>

          {/* Quick percent notches */}
          <div className="grid grid-cols-4 gap-1.5">
            {[25, 50, 75, 100].map((pct) => (
              <button
                key={pct}
                type="button"
                onClick={() => {
                  const maxAmt = (available * leverage) / lastPrice;
                  setAmount(((maxAmt * pct) / 100).toFixed(4));
                }}
                className="py-1 bg-[#2B313A] hover:bg-[#38404B] rounded text-[10px] font-mono-numbers"
              >
                {pct}%
              </button>
            ))}
          </div>

          {/* Action button */}
          <button
            onClick={handleOpenPosition}
            className={`w-full py-2.5 rounded-lg font-bold text-xs mt-1 transition-all ${
              side === 'LONG' ? 'bg-[#0ECB81] hover:bg-[#0ECB81]/90 text-white' : 'bg-[#F6465D] hover:bg-[#F6465D]/90 text-white'
            }`}
          >
            {side === 'LONG' ? `Buy / Long ${activePair.base}` : `Sell / Short ${activePair.base}`}
          </button>
        </div>
      </div>
    </div>
  );
};
