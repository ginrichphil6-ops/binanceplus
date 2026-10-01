import React, { useState, useEffect } from 'react';
import { useTrading } from '../../context/TradingContext';
import { MessageSquare, Headphones, X, Sparkles } from 'lucide-react';

interface FloatingChatButtonProps {
  className?: string;
}

export const FloatingChatButton: React.FC<FloatingChatButtonProps> = ({ className = '' }) => {
  const { setActiveModal, activeModal, currentTab } = useTrading();
  const [showBubble, setShowBubble] = useState(true);

  // Auto-hide bubble after 8 seconds, or keep subtle
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowBubble(false);
    }, 9000);
    return () => clearTimeout(timer);
  }, []);

  const handleOpenChat = () => {
    setActiveModal('LIVE_CHAT');
  };

  if (activeModal === 'LIVE_CHAT') return null;
  if (currentTab === 'TRADE') return null;

  return (
    <div className={`absolute bottom-16 right-4 z-30 select-none ${className}`}>
      {/* Interactive Helper Speech Bubble */}
      {showBubble && (
        <div className="absolute bottom-14 right-0 w-48 bg-[#1E2329] border border-[#FCD535]/60 text-xs p-2.5 rounded-xl shadow-2xl text-[#EAECEF] animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#0ECB81] animate-pulse" />
              <span className="font-bold text-[11px] text-[#FCD535]">24/7 Live Chat</span>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowBubble(false);
              }}
              className="text-[#848E9C] hover:text-[#EAECEF] p-0.5 rounded hover:bg-[#2B313A] transition-colors"
            >
              <X size={12} />
            </button>
          </div>
          <p className="text-[10px] text-[#848E9C] leading-tight mb-2">
            Instant help from VIP Specialist Sophia or chat with 1,400+ traders live!
          </p>
          <button
            onClick={handleOpenChat}
            className="w-full py-1.5 px-2 rounded-lg bg-[#FCD535] text-[#181A20] font-bold text-[10px] flex items-center justify-center gap-1.5 hover:bg-[#FCD535]/90 active:scale-95 transition-all shadow-xs"
          >
            <MessageSquare size={11} />
            <span>Start Live Chat</span>
          </button>
        </div>
      )}

      {/* The Floating Mascot Button */}
      <button
        onClick={handleOpenChat}
        onMouseEnter={() => setShowBubble(true)}
        className="group relative w-12 h-12 rounded-full bg-[#FCD535] shadow-[0_8px_25px_rgba(252,213,53,0.35)] flex items-center justify-center hover:scale-108 active:scale-95 transition-all duration-200 border-2 border-[#181A20] cursor-pointer"
        title="Open Binance 24/7 Live Chat"
      >
        {/* Cute Mascot Face with Happy Curved Eyes */}
        <div className="flex flex-col items-center justify-center transition-transform group-hover:scale-110">
          <div className="flex gap-2">
            <span className="w-1.5 h-1.5 bg-[#0E0E0E] rounded-full" />
            <span className="w-1.5 h-1.5 bg-[#0E0E0E] rounded-full" />
          </div>
          <div className="w-2.5 h-1 border-b-2 border-[#0E0E0E] rounded-full mt-0.5" />
        </div>

        {/* Live Active Online Green Badge */}
        <span className="absolute -top-0.5 -right-0.5 flex h-3.5 w-3.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#0ECB81] opacity-75" />
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-[#0ECB81] border-2 border-[#181A20] items-center justify-center">
            <span className="w-1 h-1 bg-white rounded-full" />
          </span>
        </span>

        {/* Floating Mini Tooltip Badge on Hover */}
        <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-[#1E2329] border border-[#2B313A] text-[#FCD535] text-[9px] font-bold px-1.5 py-0.5 rounded shadow-md whitespace-nowrap pointer-events-none">
          LIVE CHAT
        </span>
      </button>
    </div>
  );
};
