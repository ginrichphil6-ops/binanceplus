import React, { useState, useEffect } from 'react';
import { useTrading } from '../../context/TradingContext';
import { MarginMode, OrderType } from '../../types/crypto';
import { formatPrice, formatAmount } from '../../utils/formatters';
import { Plus, Minus, AlertCircle, CheckCircle2 } from 'lucide-react';

export const OrderEntry: React.FC = () => {
  const {
    activePair,
    lastPrice,
    assets,
    placeOrder,
    selectedPriceInput,
    setActiveModal,
  } = useTrading();

  const [marginMode, setMarginMode] = useState<MarginMode>('SPOT');
  const [orderType, setOrderType] = useState<OrderType>('LIMIT');
  const [activeSide, setActiveSide] = useState<'BUY' | 'SELL'>('BUY');

  // Input States
  const [buyPrice, setBuyPrice] = useState<string>(activePair.lastPrice.toString());
  const [buyAmount, setBuyAmount] = useState<string>('');
  const [buyPercent, setBuyPercent] = useState<number>(0);

  const [sellPrice, setSellPrice] = useState<string>(activePair.lastPrice.toString());
  const [sellAmount, setSellAmount] = useState<string>('');
  const [sellPercent, setSellPercent] = useState<number>(0);

  // Status feedback toast
  const [feedback, setFeedback] = useState<{ message: string; isError: boolean } | null>(null);

  // Synchronize when active pair changes
  useEffect(() => {
    setBuyPrice(activePair.lastPrice.toString());
    setSellPrice(activePair.lastPrice.toString());
    setBuyAmount('');
    setSellAmount('');
    setBuyPercent(0);
    setSellPercent(0);
  }, [activePair.id]);

  // Synchronize when user clicks a price in Order Book
  useEffect(() => {
    if (selectedPriceInput !== null) {
      setBuyPrice(selectedPriceInput.toString());
      setSellPrice(selectedPriceInput.toString());
    }
  }, [selectedPriceInput]);

  // User balances
  const quoteAsset = assets.find((a) => a.coin === activePair.quote);
  const baseAsset = assets.find((a) => a.coin === activePair.base);

  const availableQuote = quoteAsset ? quoteAsset.available : 0;
  const availableBase = baseAsset ? baseAsset.available : 0;

  // Percentage slider handlers
  const handleBuyPercent = (pct: number) => {
    setBuyPercent(pct);
    const p = orderType === 'MARKET' ? lastPrice : parseFloat(buyPrice) || lastPrice;
    if (p <= 0) return;
    const maxAffordable = availableQuote / p;
    const amt = (maxAffordable * (pct / 100));
    setBuyAmount(amt > 0 ? amt.toFixed(activePair.precisionAmount) : '');
  };

  const handleSellPercent = (pct: number) => {
    setSellPercent(pct);
    const amt = availableBase * (pct / 100);
    setSellAmount(amt > 0 ? amt.toFixed(activePair.precisionAmount) : '');
  };

  // Stepper handlers
  const stepPrice = (side: 'BUY' | 'SELL', delta: number) => {
    const current = side === 'BUY' ? parseFloat(buyPrice) || lastPrice : parseFloat(sellPrice) || lastPrice;
    const step = Math.max(Math.pow(10, -activePair.precisionPrice), 0.01);
    const updated = Math.max(0, current + delta * step);
    if (side === 'BUY') setBuyPrice(updated.toFixed(activePair.precisionPrice));
    else setSellPrice(updated.toFixed(activePair.precisionPrice));
  };

  // Order Submission
  const handleExecuteOrder = (side: 'BUY' | 'SELL') => {
    const price = orderType === 'MARKET' ? lastPrice : parseFloat(side === 'BUY' ? buyPrice : sellPrice);
    const amount = parseFloat(side === 'BUY' ? buyAmount : sellAmount);

    if (isNaN(amount) || amount <= 0) {
      setFeedback({ message: 'Please enter a valid amount', isError: true });
      setTimeout(() => setFeedback(null), 3500);
      return;
    }

    if (orderType !== 'MARKET' && (isNaN(price) || price <= 0)) {
      setFeedback({ message: 'Please enter a valid price', isError: true });
      setTimeout(() => setFeedback(null), 3500);
      return;
    }

    const result = placeOrder({
      side,
      type: orderType,
      price: price || lastPrice,
      amount,
      marginMode,
    });

    setFeedback({
      message: result.message,
      isError: !result.success,
    });

    if (result.success) {
      if (side === 'BUY') {
        setBuyAmount('');
        setBuyPercent(0);
      } else {
        setSellAmount('');
        setSellPercent(0);
      }
    }

    setTimeout(() => {
      setFeedback(null);
    }, 4000);
  };

  // Calculated totals
  const buyNumPrice = orderType === 'MARKET' ? lastPrice : parseFloat(buyPrice) || 0;
  const buyNumAmount = parseFloat(buyAmount) || 0;
  const buyTotal = buyNumPrice * buyNumAmount;

  const sellNumPrice = orderType === 'MARKET' ? lastPrice : parseFloat(sellPrice) || 0;
  const sellNumAmount = parseFloat(sellAmount) || 0;
  const sellTotal = sellNumPrice * sellNumAmount;

  return (
    <div className="w-full h-full flex flex-col bg-[#181A20] select-none text-xs">
      {/* Top Mode Selector (Spot, Cross 3x, Isolated 10x) */}
      <div className="h-[36px] px-3 flex items-center gap-3 border-b border-[#2B313A] shrink-0 font-medium">
        {(['SPOT', 'CROSS_3X', 'ISOLATED_10X'] as MarginMode[]).map((mode) => {
          const label = mode === 'SPOT' ? 'Spot' : mode === 'CROSS_3X' ? 'Cross 3x' : 'Isolated 10x';
          const isActive = marginMode === mode;
          return (
            <button
              key={mode}
              onClick={() => setMarginMode(mode)}
              className={`h-full relative font-medium transition-colors ${
                isActive ? 'text-[#FCD535]' : 'text-[#848E9C] hover:text-[#EAECEF]'
              }`}
            >
              <span>{label}</span>
              {isActive && (
                <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#FCD535]" />
              )}
            </button>
          );
        })}
      </div>

      {/* Order Type Tabs (Limit, Market, Stop-Limit) */}
      <div className="px-3 pt-2 pb-1 flex items-center justify-between text-[11px] shrink-0">
        <div className="flex items-center gap-4 text-[#848E9C]">
          {(['LIMIT', 'MARKET', 'STOP_LIMIT'] as OrderType[]).map((type) => {
            const label = type === 'LIMIT' ? 'Limit' : type === 'MARKET' ? 'Market' : 'Stop-Limit';
            const isActive = orderType === type;
            return (
              <button
                key={type}
                onClick={() => setOrderType(type)}
                className={`transition-colors ${
                  isActive ? 'text-[#EAECEF] font-semibold' : 'hover:text-[#EAECEF]'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* Side switch for mobile / responsive */}
        <div className="flex md:hidden bg-[#2B313A] p-0.5 rounded">
          <button
            onClick={() => setActiveSide('BUY')}
            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
              activeSide === 'BUY' ? 'bg-[#0ECB81] text-white' : 'text-[#848E9C]'
            }`}
          >
            Buy
          </button>
          <button
            onClick={() => setActiveSide('SELL')}
            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
              activeSide === 'SELL' ? 'bg-[#F6465D] text-white' : 'text-[#848E9C]'
            }`}
          >
            Sell
          </button>
        </div>
      </div>

      {/* Feedback banner */}
      {feedback && (
        <div
          className={`mx-3 my-1.5 p-2 rounded flex items-center gap-2 text-[11px] ${
            feedback.isError
              ? 'bg-[#F6465D]/15 text-[#F6465D] border border-[#F6465D]/30'
              : 'bg-[#0ECB81]/15 text-[#0ECB81] border border-[#0ECB81]/30'
          }`}
        >
          {feedback.isError ? <AlertCircle size={14} /> : <CheckCircle2 size={14} />}
          <span className="flex-1 truncate">{feedback.message}</span>
        </div>
      )}

      {/* Order Forms: Dual Column on Pro layout, single column on compact */}
      <div className="flex-1 overflow-y-auto px-3 py-2 grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* BUY COLUMN */}
        <div className={`flex flex-col gap-2.5 ${activeSide === 'SELL' ? 'hidden md:flex' : 'flex'}`}>
          {/* Balance info */}
          <div className="flex items-center justify-between text-[11px] text-[#848E9C]">
            <span>Avbl</span>
            <div className="flex items-center gap-1 font-mono-numbers">
              <span className="text-[#EAECEF]">
                {formatPrice(availableQuote, 2)} {activePair.quote}
              </span>
              <button
                onClick={() => setActiveModal('DEPOSIT')}
                className="text-[#FCD535] hover:text-[#F0B90B] p-0.5"
                title="Deposit Quote Asset"
              >
                <Plus size={12} />
              </button>
            </div>
          </div>

          {/* Price Input */}
          <div className="flex flex-col gap-1">
            <span className="text-[10px] text-[#848E9C]">Price</span>
            <div className="flex items-center bg-[#2B313A] rounded border border-transparent focus-within:border-[#848E9C] px-2.5 py-1.5 transition-colors">
              {orderType === 'MARKET' ? (
                <span className="flex-1 text-[#848E9C] text-xs font-mono-numbers py-0.5">
                  Market Price
                </span>
              ) : (
                <input
                  type="text"
                  value={buyPrice}
                  onChange={(e) => setBuyPrice(e.target.value)}
                  className="flex-1 bg-transparent text-xs font-mono-numbers text-[#EAECEF] focus:outline-none"
                  placeholder="0.00"
                />
              )}
              <span className="text-[10px] text-[#848E9C] mr-2">{activePair.quote}</span>
              {orderType !== 'MARKET' && (
                <div className="flex items-center gap-1 text-[#848E9C]">
                  <button
                    type="button"
                    onClick={() => stepPrice('BUY', -1)}
                    className="hover:text-[#EAECEF] p-0.5"
                  >
                    <Minus size={11} />
                  </button>
                  <button
                    type="button"
                    onClick={() => stepPrice('BUY', 1)}
                    className="hover:text-[#EAECEF] p-0.5"
                  >
                    <Plus size={11} />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Amount Input */}
          <div className="flex flex-col gap-1">
            <span className="text-[10px] text-[#848E9C]">Amount</span>
            <div className="flex items-center bg-[#2B313A] rounded border border-transparent focus-within:border-[#848E9C] px-2.5 py-1.5 transition-colors">
              <input
                type="text"
                value={buyAmount}
                onChange={(e) => {
                  setBuyAmount(e.target.value);
                  setBuyPercent(0);
                }}
                className="flex-1 bg-transparent text-xs font-mono-numbers text-[#EAECEF] focus:outline-none"
                placeholder="0.00"
              />
              <span className="text-[10px] text-[#848E9C]">{activePair.base}</span>
            </div>
          </div>

          {/* Percentage quick notch selector */}
          <div className="grid grid-cols-4 gap-1.5 my-0.5">
            {[25, 50, 75, 100].map((pct) => (
              <button
                key={`buy-pct-${pct}`}
                type="button"
                onClick={() => handleBuyPercent(pct)}
                className={`py-1 text-[10px] font-mono-numbers rounded transition-colors ${
                  buyPercent === pct
                    ? 'bg-[#0ECB81]/20 text-[#0ECB81] border border-[#0ECB81]/40'
                    : 'bg-[#2B313A] text-[#848E9C] hover:text-[#EAECEF]'
                }`}
              >
                {pct}%
              </button>
            ))}
          </div>

          {/* Order Total */}
          <div className="flex items-center justify-between text-[11px] text-[#848E9C] px-1 py-1 bg-[#1E2329] rounded">
            <span>Order Value</span>
            <span className="text-[#EAECEF] font-mono-numbers font-medium">
              {formatPrice(buyTotal, 2)} {activePair.quote}
            </span>
          </div>

          {/* Big Buy Button */}
          <button
            type="button"
            onClick={() => handleExecuteOrder('BUY')}
            className="w-full mt-1 py-2.5 rounded bg-[#0ECB81] hover:bg-[#0ECB81]/90 active:scale-[0.99] text-white font-bold text-xs tracking-wide transition-all shadow-sm"
          >
            Buy {activePair.base}
          </button>
        </div>

        {/* SELL COLUMN */}
        <div className={`flex flex-col gap-2.5 ${activeSide === 'BUY' ? 'hidden md:flex' : 'flex'}`}>
          {/* Balance info */}
          <div className="flex items-center justify-between text-[11px] text-[#848E9C]">
            <span>Avbl</span>
            <div className="flex items-center gap-1 font-mono-numbers">
              <span className="text-[#EAECEF]">
                {formatAmount(availableBase, activePair.precisionAmount)} {activePair.base}
              </span>
              <button
                onClick={() => setActiveModal('DEPOSIT')}
                className="text-[#FCD535] hover:text-[#F0B90B] p-0.5"
                title="Deposit Base Asset"
              >
                <Plus size={12} />
              </button>
            </div>
          </div>

          {/* Price Input */}
          <div className="flex flex-col gap-1">
            <span className="text-[10px] text-[#848E9C]">Price</span>
            <div className="flex items-center bg-[#2B313A] rounded border border-transparent focus-within:border-[#848E9C] px-2.5 py-1.5 transition-colors">
              {orderType === 'MARKET' ? (
                <span className="flex-1 text-[#848E9C] text-xs font-mono-numbers py-0.5">
                  Market Price
                </span>
              ) : (
                <input
                  type="text"
                  value={sellPrice}
                  onChange={(e) => setSellPrice(e.target.value)}
                  className="flex-1 bg-transparent text-xs font-mono-numbers text-[#EAECEF] focus:outline-none"
                  placeholder="0.00"
                />
              )}
              <span className="text-[10px] text-[#848E9C] mr-2">{activePair.quote}</span>
              {orderType !== 'MARKET' && (
                <div className="flex items-center gap-1 text-[#848E9C]">
                  <button
                    type="button"
                    onClick={() => stepPrice('SELL', -1)}
                    className="hover:text-[#EAECEF] p-0.5"
                  >
                    <Minus size={11} />
                  </button>
                  <button
                    type="button"
                    onClick={() => stepPrice('SELL', 1)}
                    className="hover:text-[#EAECEF] p-0.5"
                  >
                    <Plus size={11} />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Amount Input */}
          <div className="flex flex-col gap-1">
            <span className="text-[10px] text-[#848E9C]">Amount</span>
            <div className="flex items-center bg-[#2B313A] rounded border border-transparent focus-within:border-[#848E9C] px-2.5 py-1.5 transition-colors">
              <input
                type="text"
                value={sellAmount}
                onChange={(e) => {
                  setSellAmount(e.target.value);
                  setSellPercent(0);
                }}
                className="flex-1 bg-transparent text-xs font-mono-numbers text-[#EAECEF] focus:outline-none"
                placeholder="0.00"
              />
              <span className="text-[10px] text-[#848E9C]">{activePair.base}</span>
            </div>
          </div>

          {/* Percentage quick notch selector */}
          <div className="grid grid-cols-4 gap-1.5 my-0.5">
            {[25, 50, 75, 100].map((pct) => (
              <button
                key={`sell-pct-${pct}`}
                type="button"
                onClick={() => handleSellPercent(pct)}
                className={`py-1 text-[10px] font-mono-numbers rounded transition-colors ${
                  sellPercent === pct
                    ? 'bg-[#F6465D]/20 text-[#F6465D] border border-[#F6465D]/40'
                    : 'bg-[#2B313A] text-[#848E9C] hover:text-[#EAECEF]'
                }`}
              >
                {pct}%
              </button>
            ))}
          </div>

          {/* Order Total */}
          <div className="flex items-center justify-between text-[11px] text-[#848E9C] px-1 py-1 bg-[#1E2329] rounded">
            <span>Order Value</span>
            <span className="text-[#EAECEF] font-mono-numbers font-medium">
              {formatPrice(sellTotal, 2)} {activePair.quote}
            </span>
          </div>

          {/* Big Sell Button */}
          <button
            type="button"
            onClick={() => handleExecuteOrder('SELL')}
            className="w-full mt-1 py-2.5 rounded bg-[#F6465D] hover:bg-[#F6465D]/90 active:scale-[0.99] text-white font-bold text-xs tracking-wide transition-all shadow-sm"
          >
            Sell {activePair.base}
          </button>
        </div>
      </div>

      {/* BNB Fee Discount note */}
      <div className="px-3 py-2 border-t border-[#2B313A] text-[10px] text-[#848E9C] flex items-center justify-between shrink-0">
        <span>VIP 0 Fee: 0.075%</span>
        <span className="text-[#FCD535] cursor-pointer hover:underline">
          BNB 25% Fee Discount Active
        </span>
      </div>
    </div>
  );
};
