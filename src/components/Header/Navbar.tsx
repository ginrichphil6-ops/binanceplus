import React, { useState } from 'react';
import { useTrading } from '../../context/TradingContext';
import { BinanceLogo } from '../Icons/CryptoIcons';
import {
  Search,
  Bell,
  Wallet,
  User,
  Volume2,
  VolumeX,
  RotateCcw,
  Download,
  Globe,
  ChevronDown,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    soundEnabled,
    toggleSound,
    setActiveModal,
    notificationCount,
    resetDemoAccount,
    assets,
  } = useTrading();

  const [activeNav, setActiveNav] = useState('Trade');

  // Calculate approximate total net worth in USD
  const totalUsdBalance = assets.reduce((sum, a) => sum + a.usdValue, 0);

  return (
    <header className="h-[48px] bg-[#181A20] border-b border-[#2B313A] px-4 flex items-center justify-between text-xs select-none z-30 shrink-0">
      {/* Left: Brand + Nav items */}
      <div className="flex items-center gap-6 h-full">
        {/* Brand Lockup */}
        <div className="flex items-center gap-2 cursor-pointer hover:opacity-95 transition-opacity">
          <BinanceLogo size={22} />
          <span className="text-sm font-bold tracking-tight text-[#EAECEF] uppercase">BINANCE</span>
        </div>

        {/* Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 h-full">
          {['Buy Crypto', 'Markets', 'Trade', 'Futures', 'Bots', 'Earn', 'Square'].map((item) => {
            const isActive = activeNav === item;
            return (
              <button
                key={item}
                onClick={() => setActiveNav(item)}
                className={`relative px-3 h-full flex items-center font-medium transition-colors ${
                  isActive
                    ? 'text-[#FCD535]'
                    : 'text-[#848E9C] hover:text-[#EAECEF]'
                }`}
              >
                <span>{item}</span>
                {isActive && (
                  <span className="absolute bottom-0 left-3 right-3 h-[2px] bg-[#FCD535]" />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Right: Actions, Balance summary, User tools */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Search Shortcut */}
        <button
          onClick={() => setActiveModal('MARKETS')}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#2B313A]/60 hover:bg-[#2B313A] text-[#848E9C] hover:text-[#EAECEF] transition-colors border border-transparent hover:border-[#474D57]"
          title="Search Markets (Ctrl+K)"
        >
          <Search size={13} />
          <span className="hidden md:inline text-[11px]">Coin / Pair</span>
          <span className="hidden md:inline px-1 py-0.2 text-[9px] bg-[#181A20] rounded text-[#848E9C]">/</span>
        </button>

        {/* Deposit Button (Binance Signature Yellow) */}
        <button
          onClick={() => setActiveModal('DEPOSIT')}
          className="px-3 py-1.5 rounded-[4px] bg-[#FCD535] hover:bg-[#F0B90B] text-[#0E0E0E] font-bold text-xs tracking-tight transition-all active:scale-[0.98] shadow-xs"
        >
          Deposit
        </button>

        {/* Reset Demo Balance */}
        <button
          onClick={resetDemoAccount}
          title="Reset Demo Wallet Balance to $24,500"
          className="hidden sm:flex items-center gap-1 px-2 py-1.5 rounded text-[#848E9C] hover:text-[#EAECEF] hover:bg-[#2B313A] transition-colors"
        >
          <RotateCcw size={13} />
          <span className="text-[11px]">Reset Funds</span>
        </button>

        {/* Audio Toggle */}
        <button
          onClick={toggleSound}
          title={soundEnabled ? 'Mute Trade Sounds' : 'Enable Trade Sounds'}
          className={`p-1.5 rounded hover:bg-[#2B313A] transition-colors ${
            soundEnabled ? 'text-[#848E9C] hover:text-[#FCD535]' : 'text-[#5E6673]'
          }`}
        >
          {soundEnabled ? <Volume2 size={15} /> : <VolumeX size={15} />}
        </button>

        {/* Notification Bell */}
        <button
          onClick={() => setActiveModal('NOTIFICATIONS')}
          className="relative p-1.5 rounded text-[#848E9C] hover:text-[#EAECEF] hover:bg-[#2B313A] transition-colors"
          title="Notifications"
        >
          <Bell size={15} />
          {notificationCount > 0 && (
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#F6465D]" />
          )}
        </button>

        {/* Quick Wallet Overview */}
        <div
          onClick={() => setActiveModal('USER_PROFILE')}
          className="hidden md:flex items-center gap-1.5 px-2 py-1 rounded cursor-pointer hover:bg-[#2B313A] transition-colors text-[#848E9C] hover:text-[#EAECEF]"
        >
          <Wallet size={14} />
          <span className="text-[11px] font-mono-numbers text-[#EAECEF]">
            ${totalUsdBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
          <ChevronDown size={11} />
        </div>

        {/* User Profile */}
        <button
          onClick={() => setActiveModal('USER_PROFILE')}
          className="flex items-center gap-1.5 pl-1.5 pr-2 py-1 rounded bg-[#1E2329] hover:bg-[#2B313A] border border-[#2B313A] transition-colors"
        >
          <div className="w-5 h-5 rounded-full bg-[#FCD535]/20 text-[#FCD535] flex items-center justify-center font-bold text-[10px]">
            DP
          </div>
          <span className="hidden sm:inline text-[11px] font-medium text-[#EAECEF]">Dianne · VIP 0</span>
        </button>

        {/* App download icon */}
        <button className="hidden xl:flex p-1.5 text-[#848E9C] hover:text-[#EAECEF] hover:bg-[#2B313A] rounded transition-colors" title="Download App">
          <Download size={14} />
        </button>

        {/* Language / Currency */}
        <button className="hidden lg:flex items-center gap-1 text-[11px] text-[#848E9C] hover:text-[#EAECEF] px-1.5 py-1 rounded hover:bg-[#2B313A] transition-colors">
          <Globe size={13} />
          <span>USD</span>
        </button>
      </div>
    </header>
  );
};
