import React from 'react';
import { X, BookOpen, CheckCircle, ArrowRight } from 'lucide-react';

interface BeginnerGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartTrading: () => void;
}

export const BeginnerGuideModal: React.FC<BeginnerGuideModalProps> = ({
  isOpen,
  onClose,
  onStartTrading,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
      <div className="bg-[#1E2329] border border-[#2B313A] rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden text-xs select-none">
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#2B313A] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen size={16} className="text-[#FCD535]" />
            <span className="font-bold text-sm text-[#EAECEF]">Spot Trading Explained: A Beginner&apos;s Guide</span>
          </div>
          <button onClick={onClose} className="text-[#848E9C] hover:text-[#EAECEF] p-1">
            <X size={16} />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col gap-4 max-h-[75vh] overflow-y-auto">
          <div className="bg-[#181A20] p-4 rounded-xl border border-[#2B313A] flex flex-col gap-2">
            <span className="font-bold text-[#FCD535] text-[13px]">1. What is Spot Trading?</span>
            <p className="text-[#848E9C] leading-relaxed">
              Spot trading is the direct purchase or sale of cryptocurrencies (such as BTC, ETH, SOL) with immediate delivery and direct asset ownership into your Binance wallet.
            </p>
          </div>

          <div className="bg-[#181A20] p-4 rounded-xl border border-[#2B313A] flex flex-col gap-2">
            <span className="font-bold text-[#FCD535] text-[13px]">2. Market Order vs. Limit Order</span>
            <p className="text-[#848E9C] leading-relaxed">
              <strong className="text-[#EAECEF]">Market Order:</strong> Executes immediately at the best available current market price.<br />
              <strong className="text-[#EAECEF]">Limit Order:</strong> You set a specific maximum purchase price or minimum sell price. The order sits in the Order Book until filled.
            </p>
          </div>

          <div className="bg-[#181A20] p-4 rounded-xl border border-[#2B313A] flex flex-col gap-2">
            <span className="font-bold text-[#FCD535] text-[13px]">3. Zero Slippage & Fee Discounts</span>
            <p className="text-[#848E9C] leading-relaxed">
              Holding BNB in your wallet automatically grants you a 25% discount on all spot trading maker and taker fees.
            </p>
          </div>

          <button
            onClick={() => {
              onClose();
              onStartTrading();
            }}
            className="w-full py-3 rounded-lg bg-[#FCD535] hover:bg-[#F0B90B] text-[#0E0E0E] font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
          >
            <span>Start Trading Now</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};
