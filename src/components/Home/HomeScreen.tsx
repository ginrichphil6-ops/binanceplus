import React, { useState, useEffect } from 'react';
import { useTrading } from '../../context/TradingContext';
import { CryptoIcon } from '../Icons/CryptoIcons';
import { formatPrice } from '../../utils/formatters';
import { Sparkline } from './Sparkline';
import { WotdModal } from '../Modals/WotdModal';
import { BeginnerGuideModal } from '../Modals/BeginnerGuideModal';
import {
  Headphones,
  Search,
  ScanLine,
  ChevronUp,
  ChevronDown,
  X,
  Eye,
  EyeOff,
  Coins,
  MessageSquare,
  Sparkles,
  Flame,
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
} from 'lucide-react';

export const HomeScreen: React.FC = () => {
  const {
    homeMode,
    setHomeMode,
    setCurrentTab,
    setActivePairById,
    setActiveModal,
    assets,
    pairs,
    balanceMode,
    setBalanceMode,
    balanceHidden,
    setBalanceHidden,
  } = useTrading();

  // Modals state
  const [isWotdOpen, setIsWotdOpen] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [wotdDismissed, setWotdDismissed] = useState(false);
  const [activeFeedTab, setActiveFeedTab] = useState<'Discover' | 'Following' | 'Stocks' | 'Campaign' | 'Smart Money'>('Discover');
  const [activeCarouselIndex, setActiveCarouselIndex] = useState(0);

  // Rotating search placeholder news
  const searchHeadlines = [
    'KB Home shares down · Applied Materials AI lift',
    'Bitcoin holds $67k as ETF inflows surge',
    'Solana decentralized volume breaks records',
    'BNB Chain quarterly burn completed',
  ];
  const [headlineIndex, setHeadlineIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setHeadlineIndex((prev) => (prev + 1) % searchHeadlines.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [searchHeadlines.length]);

  // Calculate live portfolio balance if switched
  const liveTotalUsd = assets.reduce((sum, a) => sum + a.usdValue, 0);

  // Mock sparkline data matching the screenshot curves
  const solSparkData = [121.2, 120.4, 119.8, 120.1, 119.3, 118.9, 119.5, 118.4, 118.91];
  const bnbSparkData = [768.1, 769.5, 771.0, 770.2, 772.4, 771.8, 775.2, 773.0, 773.76];
  const btcSparkData = [66200, 66450, 66800, 67100, 66900, 67400, 67650, 67842.5];
  const ethSparkData = [3410, 3440, 3480, 3460, 3500, 3520, 3510, 3540.8];

  const handleSelectCoin = (symbol: string) => {
    const p = pairs.find((pair) => pair.base === symbol);
    if (p) {
      setActivePairById(p.id);
    }
    setCurrentTab('TRADE');
  };

  return (
    <div className="flex-1 w-full bg-[#181A20] text-[#EAECEF] overflow-y-auto no-scrollbar pb-20 select-none">
      {/* Centered Mobile Container Layout matching Binance App */}
      <div className="w-full max-w-md mx-auto px-4 pt-3 flex flex-col gap-4">
        {/* 1. TOP HEADER BAR */}
        <div className="flex items-center justify-between pt-1">
          {/* Left: Avatar + Customer Support Headset */}
          <div className="flex items-center gap-2.5">
            {/* Custom dark avatar with neon purple/blue abstract lines */}
            <div
              onClick={() => setActiveModal('USER_PROFILE')}
              className="w-8 h-8 rounded-full bg-[#1A1A2E] border border-[#3A3B5A] flex items-center justify-center cursor-pointer relative overflow-hidden"
              title="User Center · Dianne Pizallo"
            >
              <svg viewBox="0 0 32 32" className="w-full h-full">
                <circle cx="16" cy="16" r="16" fill="#151728" />
                <path
                  d="M4 12 C10 4, 22 8, 28 14 C20 22, 10 18, 4 28"
                  stroke="#5C42EC"
                  strokeWidth="2.5"
                  fill="none"
                />
                <path
                  d="M8 8 C14 16, 22 14, 26 24"
                  stroke="#00E5FF"
                  strokeWidth="2"
                  fill="none"
                />
              </svg>
            </div>

            <button
              onClick={() => setActiveModal('LIVE_CHAT')}
              className="text-[#848E9C] hover:text-[#EAECEF] p-1 transition-colors relative"
              title="24/7 Live Support & Chat"
            >
              <Headphones size={20} />
              <span className="absolute top-0.5 right-0.5 w-2 h-2 rounded-full bg-[#0ECB81]" />
            </button>
          </div>

          {/* Center: Exchange | Wallet Segmented Switcher */}
          <div className="bg-[#1E2329] border border-[#2B313A] rounded-full p-0.5 flex items-center">
            <button
              onClick={() => setHomeMode('EXCHANGE')}
              className={`px-3.5 py-1 rounded-full text-xs font-semibold transition-all ${
                homeMode === 'EXCHANGE'
                  ? 'bg-[#2B313A] text-[#EAECEF] shadow-xs'
                  : 'text-[#848E9C] hover:text-[#EAECEF]'
              }`}
            >
              Exchange
            </button>
            <button
              onClick={() => setHomeMode('WALLET')}
              className={`px-3.5 py-1 rounded-full text-xs font-semibold transition-all ${
                homeMode === 'WALLET'
                  ? 'bg-[#2B313A] text-[#EAECEF] shadow-xs'
                  : 'text-[#848E9C] hover:text-[#EAECEF]'
              }`}
            >
              Wallet
            </button>
          </div>

          {/* Right: Hand/Coins/Pay + Message Bell with 99+ */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveModal('DEPOSIT')}
              className="text-[#848E9C] hover:text-[#EAECEF] p-1 transition-colors"
              title="Binance Pay & Transfers"
            >
              <Coins size={19} />
            </button>

            <button
              onClick={() => setActiveModal('NOTIFICATIONS')}
              className="relative text-[#848E9C] hover:text-[#EAECEF] p-1 transition-colors"
              title="Notifications"
            >
              <MessageSquare size={19} />
              <span className="absolute -top-1 -right-1 bg-[#FCD535] text-[#0E0E0E] text-[9px] font-bold px-1 py-0.2 rounded-full leading-tight">
                99+
              </span>
            </button>
          </div>
        </div>

        {/* 2. SEARCH BAR */}
        <div
          onClick={() => setActiveModal('MARKETS')}
          className="bg-[#1E2329] border border-[#2B313A] hover:border-[#474D57] rounded-xl px-3.5 py-2 flex items-center justify-between cursor-pointer transition-colors"
        >
          <div className="flex items-center gap-2.5 overflow-hidden">
            <Search size={16} className="text-[#848E9C] shrink-0" />
            <div className="text-xs text-[#848E9C] truncate">
              {searchHeadlines[headlineIndex]}
            </div>
          </div>
          <ScanLine size={17} className="text-[#848E9C] shrink-0 hover:text-[#EAECEF]" />
        </div>

        {/* 3. ESTIMATED TOTAL VALUE (USD) SECTION */}
        <div className="flex flex-col gap-1 mt-1">
          {/* Header Row */}
          <div className="flex items-center justify-between">
            <div
              onClick={() => setBalanceHidden(!balanceHidden)}
              className="flex items-center gap-1.5 text-xs text-[#848E9C] cursor-pointer hover:text-[#EAECEF] transition-colors"
            >
              <span>Est. Total Value (USD)</span>
              {balanceHidden ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
            </div>
          </div>

          {/* Amount and Add Funds Button */}
          <div className="flex items-center justify-between">
            <div className="font-bold text-3xl tracking-tight text-[#EAECEF] font-mono-numbers">
              {balanceHidden ? '••••••••' : `$${formatPrice(liveTotalUsd, 2)}`}
            </div>

            <button
              onClick={() => setActiveModal('DEPOSIT')}
              className="bg-[#FCD535] hover:bg-[#F0B90B] active:scale-[0.98] text-[#0E0E0E] font-bold text-xs px-3.5 py-1.5 rounded-[6px] transition-all shadow-xs"
            >
              Add Funds
            </button>
          </div>

          {/* Today's PNL */}
          <div className="flex items-center gap-1 text-[11px] text-[#848E9C] font-mono-numbers mt-0.5">
            <span>Today&apos;s PNL</span>
            <span className="text-[#0ECB81]">+$1,248.65(+1.20%)</span>
            <ChevronDown size={13} className="text-[#848E9C]" />
          </div>
        </div>

        {/* 4. ONBOARDING TASKS 3/3 CARD */}
        <div className="bg-[#1E2329] border border-[#2B313A] rounded-2xl p-4 flex flex-col gap-3 shadow-sm">
          {/* Progress header & 3 segmented yellow bars */}
          <div className="flex flex-col gap-2">
            <span className="text-xs text-[#848E9C] font-medium">Onboarding Tasks 3/3</span>
            <div className="grid grid-cols-3 gap-1.5">
              <div className="h-[3px] bg-[#FCD535] rounded-full" />
              <div className="h-[3px] bg-[#FCD535] rounded-full" />
              <div className="h-[3px] bg-[#FCD535] rounded-full" />
            </div>
          </div>

          {/* Title */}
          <h2 className="text-lg font-bold text-[#EAECEF] tracking-tight">
            Start Your First Trade
          </h2>

          {/* Big Yellow Trade Button */}
          <button
            onClick={() => setCurrentTab('TRADE')}
            className="w-full bg-[#FCD535] hover:bg-[#F0B90B] active:scale-[0.99] text-[#0E0E0E] font-bold text-sm py-2.5 rounded-lg transition-all shadow-sm"
          >
            Trade
          </button>

          {/* Beginner Guide Sub-row */}
          <div className="flex items-center justify-between pt-1">
            <span className="text-xs text-[#EAECEF] font-medium">
              Spot Trading Explained: A Beginner&apos;s Guide
            </span>
            <button
              onClick={() => setIsGuideOpen(true)}
              className="bg-[#36321F] hover:bg-[#453e24] text-[#FCD535] px-3.5 py-1 rounded-md text-xs font-semibold transition-colors"
            >
              Go
            </button>
          </div>
        </div>

        {/* 5. WOTD PROMO CARD */}
        {!wotdDismissed && (
          <div className="bg-[#1E2329] border border-[#2B313A] rounded-2xl p-3.5 flex flex-col gap-2 relative shadow-sm">
            {/* Top row */}
            <div className="flex items-center justify-between text-xs text-[#848E9C]">
              <span>WOTD: IPOs Are Moving On-Chain</span>
              <button
                onClick={() => setWotdDismissed(true)}
                className="hover:text-[#EAECEF] p-0.5 transition-colors"
              >
                <X size={14} />
              </button>
            </div>

            {/* Main Content */}
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                {/* 4 Square Tiles Icon */}
                <div className="w-7 h-7 grid grid-cols-2 gap-0.5 shrink-0">
                  <div className="bg-[#FCD535] rounded-[2px]" />
                  <div className="border border-white/80 rounded-[2px]" />
                  <div className="border border-white/80 rounded-[2px]" />
                  <div className="bg-[#FCD535] rounded-[2px]" />
                </div>
                <span className="text-xs font-semibold text-[#EAECEF]">
                  Solve Daily Words to Unlock Rewards
                </span>
              </div>

              <button
                onClick={() => setIsWotdOpen(true)}
                className="bg-[#2B313A] hover:bg-[#38404B] text-white text-xs font-semibold px-3 py-1 rounded-lg shrink-0 transition-colors"
              >
                Join
              </button>
            </div>

            {/* Carousel Dots */}
            <div className="flex items-center justify-center gap-1.5 pt-1">
              {[0, 1, 2, 3, 4].map((idx) => (
                <span
                  key={idx}
                  onClick={() => setActiveCarouselIndex(idx)}
                  className={`h-1 rounded-full cursor-pointer transition-all ${
                    activeCarouselIndex === idx
                      ? 'w-3 bg-white'
                      : 'w-1 bg-[#474D57]'
                  }`}
                />
              ))}
            </div>
          </div>
        )}

        {/* 6. CRYPTO MINI-CARDS (SOL & BNB MATCHING SCREENSHOT) */}
        <div className="grid grid-cols-2 gap-3">
          {/* Card 1: SOL */}
          <div
            onClick={() => handleSelectCoin('SOL')}
            className="bg-[#1E2329] border border-[#2B313A] hover:border-[#474D57] rounded-2xl p-3.5 flex flex-col justify-between cursor-pointer transition-colors h-36"
          >
            <div>
              <div className="flex items-center gap-1.5 mb-1.5">
                <CryptoIcon symbol="SOL" size={17} />
                <span className="text-xs font-bold text-[#848E9C]">SOL</span>
              </div>
              <div className="font-bold text-lg text-[#EAECEF] font-mono-numbers">
                118.91
              </div>
              <div className="flex items-center gap-0.5 text-xs font-semibold text-[#F6465D] font-mono-numbers">
                <span>▼</span>
                <span>0.52%</span>
              </div>
            </div>

            <div className="h-9 w-full mt-2">
              <Sparkline data={solSparkData} color="#F6465D" />
            </div>
          </div>

          {/* Card 2: BNB */}
          <div
            onClick={() => handleSelectCoin('BNB')}
            className="bg-[#1E2329] border border-[#2B313A] hover:border-[#474D57] rounded-2xl p-3.5 flex flex-col justify-between cursor-pointer transition-colors h-36"
          >
            <div>
              <div className="flex items-center gap-1.5 mb-1.5">
                <CryptoIcon symbol="BNB" size={17} />
                <span className="text-xs font-bold text-[#848E9C]">BNB</span>
              </div>
              <div className="font-bold text-lg text-[#EAECEF] font-mono-numbers">
                773.76
              </div>
              <div className="flex items-center gap-0.5 text-xs font-semibold text-[#0ECB81] font-mono-numbers">
                <span>▲</span>
                <span>0.59%</span>
              </div>
            </div>

            <div className="h-9 w-full mt-2">
              <Sparkline data={bnbSparkData} color="#0ECB81" />
            </div>
          </div>
        </div>

        {/* Bonus Quick Top Pairs (BTC & ETH) */}
        <div className="grid grid-cols-2 gap-3">
          {/* BTC */}
          <div
            onClick={() => handleSelectCoin('BTC')}
            className="bg-[#1E2329] border border-[#2B313A] hover:border-[#474D57] rounded-2xl p-3.5 flex flex-col justify-between cursor-pointer transition-colors h-36"
          >
            <div>
              <div className="flex items-center gap-1.5 mb-1.5">
                <CryptoIcon symbol="BTC" size={17} />
                <span className="text-xs font-bold text-[#848E9C]">BTC</span>
              </div>
              <div className="font-bold text-lg text-[#EAECEF] font-mono-numbers">
                67,842.50
              </div>
              <div className="flex items-center gap-0.5 text-xs font-semibold text-[#0ECB81] font-mono-numbers">
                <span>▲</span>
                <span>2.40%</span>
              </div>
            </div>

            <div className="h-9 w-full mt-2">
              <Sparkline data={btcSparkData} color="#0ECB81" />
            </div>
          </div>

          {/* ETH */}
          <div
            onClick={() => handleSelectCoin('ETH')}
            className="bg-[#1E2329] border border-[#2B313A] hover:border-[#474D57] rounded-2xl p-3.5 flex flex-col justify-between cursor-pointer transition-colors h-36"
          >
            <div>
              <div className="flex items-center gap-1.5 mb-1.5">
                <CryptoIcon symbol="ETH" size={17} />
                <span className="text-xs font-bold text-[#848E9C]">ETH</span>
              </div>
              <div className="font-bold text-lg text-[#EAECEF] font-mono-numbers">
                3,540.80
              </div>
              <div className="flex items-center gap-0.5 text-xs font-semibold text-[#0ECB81] font-mono-numbers">
                <span>▲</span>
                <span>3.84%</span>
              </div>
            </div>

            <div className="h-9 w-full mt-2">
              <Sparkline data={ethSparkData} color="#0ECB81" />
            </div>
          </div>
        </div>

        {/* 7. FEED TABS BAR */}
        <div className="border-b border-[#2B313A] flex items-center gap-5 text-sm overflow-x-auto no-scrollbar shrink-0 mt-1">
          {(['Discover', 'Following', 'Stocks', 'Campaign', 'Smart Money'] as const).map((tab) => {
            const isActive = activeFeedTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveFeedTab(tab)}
                className={`relative pb-2 font-medium flex items-center gap-1 whitespace-nowrap transition-colors ${
                  isActive ? 'text-[#EAECEF] font-bold' : 'text-[#848E9C] hover:text-[#EAECEF]'
                }`}
              >
                <span>{tab}</span>
                {tab === 'Stocks' && (
                  <span className="bg-[#FCD535] text-[#0E0E0E] text-[9px] font-extrabold px-1 rounded-sm uppercase tracking-wider">
                    NEW
                  </span>
                )}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#FCD535] rounded-full" />
                )}
              </button>
            );
          })}
        </div>

        {/* 8. BINANCE SQUARE FEED POSTS */}
        <div className="flex flex-col gap-3">
          <div className="bg-[#1E2329] border border-[#2B313A] rounded-xl p-3.5 flex flex-col gap-2">
            <div className="flex items-center justify-between text-[11px] text-[#848E9C]">
              <span className="font-semibold text-[#EAECEF]">Binance News Official</span>
              <span>12m ago</span>
            </div>
            <p className="text-xs text-[#EAECEF] leading-relaxed">
              Global crypto market cap crosses $2.65T as institutional spot inflows maintain steady pace across tier-1 exchanges.
            </p>
            <div className="flex items-center gap-2 pt-1 text-[11px] text-[#848E9C]">
              <span className="text-[#FCD535] bg-[#FCD535]/10 px-1.5 py-0.5 rounded font-mono-numbers">#BTC</span>
              <span className="text-[#0ECB81] bg-[#0ECB81]/10 px-1.5 py-0.5 rounded font-mono-numbers">#BNB</span>
              <span>· 1.4k Reads</span>
            </div>
          </div>

          <div className="bg-[#1E2329] border border-[#2B313A] rounded-xl p-3.5 flex flex-col gap-2">
            <div className="flex items-center justify-between text-[11px] text-[#848E9C]">
              <span className="font-semibold text-[#EAECEF]">CoinDesk Feed</span>
              <span>45m ago</span>
            </div>
            <p className="text-xs text-[#EAECEF] leading-relaxed">
              Applied Materials & semiconductors rally as AI infrastructure investment boosts macroeconomic risk sentiment.
            </p>
            <div className="flex items-center gap-2 pt-1 text-[11px] text-[#848E9C]">
              <span className="text-[#627EEA] bg-[#627EEA]/10 px-1.5 py-0.5 rounded font-mono-numbers">#SOL</span>
              <span>· 890 Reads</span>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <WotdModal isOpen={isWotdOpen} onClose={() => setIsWotdOpen(false)} />
      <BeginnerGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
        onStartTrading={() => setCurrentTab('TRADE')}
      />
    </div>
  );
};
