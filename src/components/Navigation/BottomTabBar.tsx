import React from 'react';
import { useTrading } from '../../context/TradingContext';
import { AppTab } from '../../types/crypto';
import { BinanceLogo } from '../Icons/CryptoIcons';
import { TrendingUp, ArrowLeftRight, FileText, Wallet } from 'lucide-react';

export const BottomTabBar: React.FC = () => {
  const { currentTab, setCurrentTab } = useTrading();

  const tabs: { id: AppTab; label: string; icon: React.ReactNode }[] = [
    {
      id: 'HOME',
      label: 'Home',
      icon: (
        <div className="relative">
          <BinanceLogo size={19} />
        </div>
      ),
    },
    {
      id: 'MARKETS',
      label: 'Markets',
      icon: <TrendingUp size={19} />,
    },
    {
      id: 'TRADE',
      label: 'Trade',
      icon: (
        <div className="w-5 h-5 rounded-full border border-current flex items-center justify-center">
          <ArrowLeftRight size={12} />
        </div>
      ),
    },
    {
      id: 'FUTURES',
      label: 'Futures',
      icon: <FileText size={19} />,
    },
    {
      id: 'ASSETS',
      label: 'Assets',
      icon: <Wallet size={19} />,
    },
  ];

  return (
    <div className="h-[58px] bg-[#181A20] border-t border-[#2B313A] px-2 flex items-center justify-around select-none shrink-0 z-40">
      {tabs.map((tab) => {
        const isActive = currentTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setCurrentTab(tab.id)}
            className={`flex-1 flex flex-col items-center justify-center gap-1 py-1 transition-colors ${
              isActive
                ? 'text-[#FCD535]'
                : 'text-[#848E9C] hover:text-[#EAECEF]'
            }`}
          >
            <div className={`transition-transform duration-150 ${isActive ? 'scale-105' : ''}`}>
              {tab.icon}
            </div>
            <span
              className={`text-[10px] tracking-tight ${
                isActive ? 'font-semibold text-[#EAECEF]' : 'font-normal'
              }`}
            >
              {tab.label}
            </span>
          </button>
        );
      })}
    </div>
  );
};
