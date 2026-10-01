import React, { useState } from 'react';
import { useTrading } from '../../context/TradingContext';
import { CryptoIcon } from '../Icons/CryptoIcons';
import { formatPrice, formatAmount } from '../../utils/formatters';
import { Eye, EyeOff, ArrowDownLeft, ArrowUpRight, Repeat, Plus } from 'lucide-react';

export const AssetsScreen: React.FC = () => {
  const { assets, setActiveModal, depositDemoFunds, activePair } = useTrading();
  const [hideZero, setHideZero] = useState(false);
  const [assetTab, setAssetTab] = useState<'Overview' | 'Spot' | 'Funding' | 'Futures'>('Spot');
  const [hidden, setHidden] = useState(false);

  const totalUsd = assets.reduce((sum, a) => sum + a.usdValue, 0);
  const totalBtc = activePair.lastPrice > 0 ? totalUsd / activePair.lastPrice : 0;

  const filteredAssets = hideZero ? assets.filter((a) => a.total > 0) : assets;

  return (
    <div className="flex-1 w-full bg-[#181A20] text-[#EAECEF] overflow-y-auto no-scrollbar pb-20 select-none">
      <div className="w-full max-w-md mx-auto px-4 pt-3 flex flex-col gap-4 text-xs">
        {/* Header Tabs */}
        <div className="flex items-center gap-5 border-b border-[#2B313A] pb-2 text-sm overflow-x-auto no-scrollbar font-medium">
          {(['Overview', 'Spot', 'Funding', 'Futures'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setAssetTab(tab)}
              className={`whitespace-nowrap transition-colors ${
                assetTab === tab ? 'text-[#FCD535] font-bold' : 'text-[#848E9C] hover:text-[#EAECEF]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Balance Card */}
        <div className="bg-[#1E2329] border border-[#2B313A] rounded-2xl p-4 flex flex-col gap-3">
          <div className="flex items-center justify-between text-[#848E9C]">
            <div className="flex items-center gap-1.5 cursor-pointer" onClick={() => setHidden(!hidden)}>
              <span>Total Balance</span>
              {hidden ? <EyeOff size={14} /> : <Eye size={14} />}
            </div>
          </div>

          <div className="flex flex-col">
            <div className="text-2xl font-bold font-mono-numbers text-[#EAECEF]">
              {hidden ? '••••••••' : `$${formatPrice(totalUsd, 2)}`}
            </div>
            <div className="text-[11px] text-[#848E9C] font-mono-numbers">
              ≈ {hidden ? '••••' : `${totalBtc.toFixed(4)} BTC`}
            </div>
          </div>

          {/* Action Buttons: Deposit, Withdraw, Transfer */}
          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#2B313A]">
            <button
              onClick={() => setActiveModal('DEPOSIT')}
              className="py-2 rounded-lg bg-[#FCD535] hover:bg-[#F0B90B] text-[#0E0E0E] font-bold text-xs flex items-center justify-center gap-1"
            >
              <ArrowDownLeft size={14} />
              <span>Deposit</span>
            </button>

            <button
              onClick={() => setActiveModal('WITHDRAW')}
              className="py-2 rounded-lg bg-[#2B313A] hover:bg-[#38404B] text-[#EAECEF] font-semibold text-xs flex items-center justify-center gap-1"
            >
              <ArrowUpRight size={14} />
              <span>Withdraw</span>
            </button>

            <button
              onClick={() => depositDemoFunds('USDT', 5000)}
              className="py-2 rounded-lg bg-[#2B313A] hover:bg-[#38404B] text-[#EAECEF] font-semibold text-xs flex items-center justify-center gap-1"
            >
              <Plus size={14} />
              <span>+$5K USDT</span>
            </button>
          </div>
        </div>

        {/* Balances List */}
        <div className="flex items-center justify-between pt-1">
          <span className="font-bold text-sm text-[#EAECEF]">Balances</span>
          <label className="flex items-center gap-1.5 text-[11px] text-[#848E9C] cursor-pointer">
            <input
              type="checkbox"
              checked={hideZero}
              onChange={(e) => setHideZero(e.target.checked)}
              className="w-3.5 h-3.5 accent-[#FCD535] rounded"
            />
            <span>Hide 0 Balances</span>
          </label>
        </div>

        <div className="flex flex-col divide-y divide-[#2B313A]/40 bg-[#1E2329] border border-[#2B313A] rounded-2xl overflow-hidden">
          {filteredAssets.map((asset) => (
            <div
              key={asset.coin}
              className="p-3.5 flex items-center justify-between hover:bg-[#2B313A]/40 transition-colors"
            >
              <div className="flex items-center gap-3">
                <CryptoIcon symbol={asset.coin} size={26} />
                <div className="flex flex-col">
                  <span className="font-bold text-sm text-[#EAECEF]">{asset.coin}</span>
                  <span className="text-[10px] text-[#848E9C]">{asset.name}</span>
                </div>
              </div>

              <div className="flex flex-col text-right font-mono-numbers">
                <span className="font-bold text-sm text-[#EAECEF]">
                  {hidden ? '••••' : formatAmount(asset.total, 4)}
                </span>
                <span className="text-[11px] text-[#848E9C]">
                  ${hidden ? '••••' : formatPrice(asset.usdValue, 2)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
