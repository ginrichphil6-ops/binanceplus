import React from 'react';
import { useTrading } from '../../context/TradingContext';
import { X, CheckCircle2, TrendingUp, Bell, ArrowRight } from 'lucide-react';
import { formatDateTime } from '../../utils/formatters';

export const NotificationDrawer: React.FC = () => {
  const { activeModal, setActiveModal, tradeHistory } = useTrading();

  if (activeModal !== 'NOTIFICATIONS') return null;

  const notifications = [
    ...tradeHistory.map((tr) => ({
      id: `notif-${tr.id}`,
      title: `Order Filled: ${tr.side} ${tr.amount} ${tr.pair}`,
      desc: `Executed at price $${tr.price.toFixed(2)}. Total: $${tr.total.toFixed(2)}`,
      time: tr.timestamp,
      type: 'TRADE',
    })),
    {
      id: 'notif-sys-1',
      title: 'Demo Balance Ready',
      desc: 'Your demo paper trading account has been provisioned with $24,500.00 USDT and multi-asset crypto balance.',
      time: Date.now() - 3600000 * 2,
      type: 'SYSTEM',
    },
    {
      id: 'notif-sys-2',
      title: 'Binance Spot Grid Upgraded',
      desc: 'New cross-margin mode enabled with up to 10x leverage on BTC/USDT and ETH/USDT.',
      time: Date.now() - 86400000,
      type: 'ANNOUNCEMENT',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-end p-0">
      <div className="bg-[#1E2329] border-l border-[#2B313A] w-full max-w-sm h-full shadow-2xl flex flex-col select-none">
        {/* Header */}
        <div className="px-4 py-3.5 border-b border-[#2B313A] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell size={16} className="text-[#FCD535]" />
            <span className="font-bold text-sm text-[#EAECEF]">Notifications</span>
          </div>
          <button
            onClick={() => setActiveModal(null)}
            className="text-[#848E9C] hover:text-[#EAECEF] p-1 rounded hover:bg-[#2B313A] transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto no-scrollbar divide-y divide-[#2B313A]/50 text-xs">
          {notifications.map((item) => (
            <div key={item.id} className="p-4 hover:bg-[#2B313A]/40 transition-colors flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#EAECEF] text-[12px]">{item.title}</span>
                <span className="text-[10px] text-[#848E9C]">{formatDateTime(item.time)}</span>
              </div>
              <p className="text-[#848E9C] text-[11px] leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
