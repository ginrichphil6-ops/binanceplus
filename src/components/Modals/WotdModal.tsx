import React, { useState } from 'react';
import { X, Trophy, Sparkles, Check, HelpCircle } from 'lucide-react';

interface WotdModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WotdModal: React.FC<WotdModalProps> = ({ isOpen, onClose }) => {
  const [guess, setGuess] = useState('');
  const [solved, setSolved] = useState(false);
  const targetWord = 'BLOCKCHAIN';

  if (!isOpen) return null;

  const handleCheck = () => {
    if (guess.trim().toUpperCase() === targetWord || guess.trim().length >= 4) {
      setSolved(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
      <div className="bg-[#1E2329] border border-[#2B313A] rounded-2xl w-full max-w-md shadow-2xl overflow-hidden text-xs select-none">
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#2B313A] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-[#FCD535]/20 text-[#FCD535] flex items-center justify-center font-bold">
              <Trophy size={14} />
            </div>
            <span className="font-bold text-sm text-[#EAECEF]">Word of the Day (WOTD)</span>
          </div>
          <button onClick={onClose} className="text-[#848E9C] hover:text-[#EAECEF] p-1">
            <X size={16} />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col gap-4">
          <div className="bg-[#181A20] p-4 rounded-xl border border-[#2B313A] flex flex-col gap-2">
            <div className="flex items-center justify-between text-[#848E9C] text-[11px]">
              <span>Topic: IPOs Moving On-Chain</span>
              <span className="text-[#FCD535] font-semibold">Reward: 10 USDT Voucher</span>
            </div>
            <p className="text-[#EAECEF] leading-relaxed text-[11px]">
              Hint: A decentralized distributed digital ledger consisting of records called blocks linked using cryptography.
            </p>
          </div>

          {solved ? (
            <div className="bg-[#0ECB81]/15 border border-[#0ECB81]/40 rounded-xl p-4 flex flex-col items-center gap-2 text-center">
              <div className="w-10 h-10 rounded-full bg-[#0ECB81] text-white flex items-center justify-center">
                <Check size={20} />
              </div>
              <span className="font-bold text-sm text-[#0ECB81]">Congratulations!</span>
              <p className="text-[#EAECEF] text-[11px]">
                You solved today&apos;s puzzle: <span className="font-bold text-[#FCD535]">BLOCKCHAIN</span>. 50 Binance Points credited to your Reward Hub!
              </p>
              <button
                onClick={onClose}
                className="mt-2 w-full py-2 bg-[#FCD535] text-[#0E0E0E] font-bold rounded-lg"
              >
                Claim & Close
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <label className="text-[#848E9C] text-[11px]">Enter Today&apos;s Word:</label>
              <input
                type="text"
                value={guess}
                onChange={(e) => setGuess(e.target.value)}
                placeholder="e.g. BLOCKCHAIN"
                className="w-full bg-[#181A20] border border-[#2B313A] focus:border-[#FCD535] rounded-lg px-3 py-2 text-sm uppercase font-mono-numbers text-[#EAECEF] tracking-widest focus:outline-none"
              />
              <button
                onClick={handleCheck}
                className="w-full py-2.5 rounded-lg bg-[#FCD535] hover:bg-[#F0B90B] text-[#0E0E0E] font-bold text-xs transition-colors"
              >
                Submit Word
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
