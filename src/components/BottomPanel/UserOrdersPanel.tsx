import React, { useState } from 'react';
import { useTrading } from '../../context/TradingContext';
import { formatPrice, formatAmount, formatDateTime } from '../../utils/formatters';
import { CryptoIcon } from '../Icons/CryptoIcons';
import { Trash2, Plus, ArrowUpRight, CheckCircle2, XCircle } from 'lucide-react';

export const UserOrdersPanel: React.FC = () => {
  const {
    openOrders,
    orderHistory,
    tradeHistory,
    assets,
    cancelOrder,
    cancelAllOrders,
    activePair,
    setActiveModal,
    depositDemoFunds,
  } = useTrading();

  const [activeTab, setActiveTab] = useState<
    'OPEN' | 'ORDER_HISTORY' | 'TRADE_HISTORY' | 'ASSETS' | 'BOTS'
  >('OPEN');
  const [hideOtherPairs, setHideOtherPairs] = useState<boolean>(false);

  // Filtered orders
  const displayOpenOrders = hideOtherPairs
    ? openOrders.filter((o) => o.pair === activePair.symbol)
    : openOrders;

  const displayOrderHistory = hideOtherPairs
    ? orderHistory.filter((o) => o.pair === activePair.symbol)
    : orderHistory;

  const displayTradeHistory = hideOtherPairs
    ? tradeHistory.filter((o) => o.pair === activePair.symbol)
    : tradeHistory;

  return (
    <div className="w-full h-full flex flex-col bg-[#181A20] select-none text-xs border-t border-[#2B313A]">
      {/* Tab Navigation Header */}
      <div className="h-[36px] px-4 flex items-center justify-between border-b border-[#2B313A] shrink-0">
        <div className="flex items-center gap-6 h-full font-medium">
          <button
            onClick={() => setActiveTab('OPEN')}
            className={`h-full relative transition-colors ${
              activeTab === 'OPEN' ? 'text-[#EAECEF]' : 'text-[#848E9C] hover:text-[#EAECEF]'
            }`}
          >
            <span>Open Orders ({openOrders.length})</span>
            {activeTab === 'OPEN' && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#FCD535]" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('ORDER_HISTORY')}
            className={`h-full relative transition-colors ${
              activeTab === 'ORDER_HISTORY' ? 'text-[#EAECEF]' : 'text-[#848E9C] hover:text-[#EAECEF]'
            }`}
          >
            <span>Order History</span>
            {activeTab === 'ORDER_HISTORY' && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#FCD535]" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('TRADE_HISTORY')}
            className={`h-full relative transition-colors ${
              activeTab === 'TRADE_HISTORY' ? 'text-[#EAECEF]' : 'text-[#848E9C] hover:text-[#EAECEF]'
            }`}
          >
            <span>Trade History</span>
            {activeTab === 'TRADE_HISTORY' && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#FCD535]" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('ASSETS')}
            className={`h-full relative transition-colors ${
              activeTab === 'ASSETS' ? 'text-[#EAECEF]' : 'text-[#848E9C] hover:text-[#EAECEF]'
            }`}
          >
            <span>Assets & Balances</span>
            {activeTab === 'ASSETS' && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#FCD535]" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('BOTS')}
            className={`hidden sm:inline-block h-full relative transition-colors ${
              activeTab === 'BOTS' ? 'text-[#EAECEF]' : 'text-[#848E9C] hover:text-[#EAECEF]'
            }`}
          >
            <span>Grid Bots (0)</span>
            {activeTab === 'BOTS' && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#FCD535]" />
            )}
          </button>
        </div>

        {/* Right Controls: Filter & Cancel All */}
        {activeTab !== 'ASSETS' && activeTab !== 'BOTS' && (
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-1.5 cursor-pointer text-[11px] text-[#848E9C] hover:text-[#EAECEF]">
              <input
                type="checkbox"
                checked={hideOtherPairs}
                onChange={(e) => setHideOtherPairs(e.target.checked)}
                className="w-3.5 h-3.5 rounded bg-[#2B313A] border-[#474D57] accent-[#FCD535] cursor-pointer"
              />
              <span>Hide Other Pairs</span>
            </label>

            {activeTab === 'OPEN' && openOrders.length > 0 && (
              <button
                onClick={cancelAllOrders}
                className="px-2 py-0.5 rounded text-[11px] font-medium bg-[#2B313A] hover:bg-[#F6465D]/20 text-[#848E9C] hover:text-[#F6465D] transition-colors"
              >
                Cancel All
              </button>
            )}
          </div>
        )}
      </div>

      {/* Main Panel Content Area */}
      <div className="flex-1 overflow-y-auto no-scrollbar">
        {/* TAB 1: OPEN ORDERS */}
        {activeTab === 'OPEN' && (
          <>
            {displayOpenOrders.length === 0 ? (
              <div className="h-32 flex flex-col items-center justify-center text-[#848E9C] gap-1">
                <span>No open orders</span>
                <span className="text-[11px]">Submit a Limit order above to view pending executions</span>
              </div>
            ) : (
              <table className="w-full text-left text-[11px] font-mono-numbers">
                <thead>
                  <tr className="text-[#848E9C] font-sans border-b border-[#2B313A] text-[10px]">
                    <th className="py-2 px-4">Date</th>
                    <th className="py-2 px-2">Pair</th>
                    <th className="py-2 px-2">Type</th>
                    <th className="py-2 px-2">Side</th>
                    <th className="py-2 px-2 text-right">Price</th>
                    <th className="py-2 px-2 text-right">Amount</th>
                    <th className="py-2 px-2 text-right">Filled</th>
                    <th className="py-2 px-2 text-right">Total</th>
                    <th className="py-2 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2B313A]/40">
                  {displayOpenOrders.map((ord) => {
                    const isBuy = ord.side === 'BUY';
                    const fillPct = (ord.filled / ord.amount) * 100;
                    return (
                      <tr key={ord.id} className="hover:bg-[#2B313A]/40 transition-colors">
                        <td className="py-2 px-4 text-[#848E9C]">{formatDateTime(ord.timestamp)}</td>
                        <td className="py-2 px-2 font-bold text-[#EAECEF]">{ord.pair}</td>
                        <td className="py-2 px-2 text-[#848E9C]">{ord.type}</td>
                        <td className="py-2 px-2 font-semibold">
                          <span
                            className={`px-1.5 py-0.5 rounded text-[10px] ${
                              isBuy ? 'text-[#0ECB81] bg-[#0ECB81]/15' : 'text-[#F6465D] bg-[#F6465D]/15'
                            }`}
                          >
                            {ord.side}
                          </span>
                        </td>
                        <td className="py-2 px-2 text-right text-[#EAECEF]">
                          {formatPrice(ord.price, 2)}
                        </td>
                        <td className="py-2 px-2 text-right text-[#EAECEF]">
                          {formatAmount(ord.amount, 4)}
                        </td>
                        <td className="py-2 px-2 text-right text-[#848E9C]">
                          {fillPct.toFixed(1)}%
                        </td>
                        <td className="py-2 px-2 text-right text-[#EAECEF]">
                          ${formatPrice(ord.total, 2)}
                        </td>
                        <td className="py-2 px-4 text-right">
                          <button
                            onClick={() => cancelOrder(ord.id)}
                            className="text-[#848E9C] hover:text-[#F6465D] p-1 rounded hover:bg-[#2B313A] transition-colors"
                            title="Cancel Order"
                          >
                            Cancel
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </>
        )}

        {/* TAB 2: ORDER HISTORY */}
        {activeTab === 'ORDER_HISTORY' && (
          <>
            {displayOrderHistory.length === 0 ? (
              <div className="h-32 flex items-center justify-center text-[#848E9C]">
                No historical orders found
              </div>
            ) : (
              <table className="w-full text-left text-[11px] font-mono-numbers">
                <thead>
                  <tr className="text-[#848E9C] font-sans border-b border-[#2B313A] text-[10px]">
                    <th className="py-2 px-4">Date</th>
                    <th className="py-2 px-2">Pair</th>
                    <th className="py-2 px-2">Type</th>
                    <th className="py-2 px-2">Side</th>
                    <th className="py-2 px-2 text-right">Avg Price</th>
                    <th className="py-2 px-2 text-right">Executed Amount</th>
                    <th className="py-2 px-2 text-right">Total</th>
                    <th className="py-2 px-4 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2B313A]/40">
                  {displayOrderHistory.map((ord) => {
                    const isBuy = ord.side === 'BUY';
                    const isFilled = ord.status === 'FILLED';
                    return (
                      <tr key={ord.id} className="hover:bg-[#2B313A]/40 transition-colors">
                        <td className="py-2 px-4 text-[#848E9C]">{formatDateTime(ord.timestamp)}</td>
                        <td className="py-2 px-2 font-bold text-[#EAECEF]">{ord.pair}</td>
                        <td className="py-2 px-2 text-[#848E9C]">{ord.type}</td>
                        <td className="py-2 px-2 font-semibold">
                          <span
                            className={`px-1.5 py-0.5 rounded text-[10px] ${
                              isBuy ? 'text-[#0ECB81] bg-[#0ECB81]/15' : 'text-[#F6465D] bg-[#F6465D]/15'
                            }`}
                          >
                            {ord.side}
                          </span>
                        </td>
                        <td className="py-2 px-2 text-right text-[#EAECEF]">
                          {formatPrice(ord.price, 2)}
                        </td>
                        <td className="py-2 px-2 text-right text-[#EAECEF]">
                          {formatAmount(ord.filled, 4)}
                        </td>
                        <td className="py-2 px-2 text-right text-[#EAECEF]">
                          ${formatPrice(ord.total, 2)}
                        </td>
                        <td className="py-2 px-4 text-right">
                          <span
                            className={`inline-flex items-center gap-1 font-sans text-[11px] ${
                              isFilled ? 'text-[#0ECB81]' : 'text-[#848E9C]'
                            }`}
                          >
                            {isFilled ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                            {ord.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </>
        )}

        {/* TAB 3: TRADE HISTORY */}
        {activeTab === 'TRADE_HISTORY' && (
          <>
            {displayTradeHistory.length === 0 ? (
              <div className="h-32 flex items-center justify-center text-[#848E9C]">
                No trade executions recorded
              </div>
            ) : (
              <table className="w-full text-left text-[11px] font-mono-numbers">
                <thead>
                  <tr className="text-[#848E9C] font-sans border-b border-[#2B313A] text-[10px]">
                    <th className="py-2 px-4">Date</th>
                    <th className="py-2 px-2">Pair</th>
                    <th className="py-2 px-2">Side</th>
                    <th className="py-2 px-2 text-right">Exec Price</th>
                    <th className="py-2 px-2 text-right">Exec Amount</th>
                    <th className="py-2 px-2 text-right">Fee (0.075%)</th>
                    <th className="py-2 px-4 text-right">Role</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2B313A]/40">
                  {displayTradeHistory.map((tr) => {
                    const isBuy = tr.side === 'BUY';
                    const fee = tr.total * 0.00075;
                    return (
                      <tr key={tr.id} className="hover:bg-[#2B313A]/40 transition-colors">
                        <td className="py-2 px-4 text-[#848E9C]">{formatDateTime(tr.timestamp)}</td>
                        <td className="py-2 px-2 font-bold text-[#EAECEF]">{tr.pair}</td>
                        <td className="py-2 px-2 font-semibold">
                          <span
                            className={`px-1.5 py-0.5 rounded text-[10px] ${
                              isBuy ? 'text-[#0ECB81] bg-[#0ECB81]/15' : 'text-[#F6465D] bg-[#F6465D]/15'
                            }`}
                          >
                            {tr.side}
                          </span>
                        </td>
                        <td className="py-2 px-2 text-right text-[#EAECEF]">
                          {formatPrice(tr.price, 2)}
                        </td>
                        <td className="py-2 px-2 text-right text-[#EAECEF]">
                          {formatAmount(tr.amount, 4)}
                        </td>
                        <td className="py-2 px-2 text-right text-[#848E9C]">
                          {formatPrice(fee, 4)} USDT
                        </td>
                        <td className="py-2 px-4 text-right text-[#848E9C] font-sans">
                          {tr.type === 'MARKET' ? 'Taker' : 'Maker'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </>
        )}

        {/* TAB 4: ASSETS & BALANCES */}
        {activeTab === 'ASSETS' && (
          <div className="p-3">
            <div className="flex items-center justify-between pb-3 mb-2 border-b border-[#2B313A]">
              <div>
                <span className="text-[11px] text-[#848E9C]">Total Estimated Balance</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-base font-bold font-mono-numbers text-[#EAECEF]">
                    ${assets.reduce((sum, a) => sum + a.usdValue, 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                  <span className="text-xs text-[#848E9C] font-mono-numbers">
                    ≈ {(assets.reduce((sum, a) => sum + a.usdValue, 0) / activePair.lastPrice).toFixed(4)} BTC
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => depositDemoFunds('USDT', 5000)}
                  className="px-2.5 py-1 rounded bg-[#FCD535] hover:bg-[#F0B90B] text-[#0E0E0E] font-bold text-[11px] transition-colors"
                >
                  + Add $5,000 USDT Demo Funds
                </button>
                <button
                  onClick={() => setActiveModal('DEPOSIT')}
                  className="px-2.5 py-1 rounded bg-[#2B313A] hover:bg-[#474D57] text-[#EAECEF] font-medium text-[11px] transition-colors"
                >
                  Deposit Portal
                </button>
              </div>
            </div>

            <table className="w-full text-left text-[11px] font-mono-numbers">
              <thead>
                <tr className="text-[#848E9C] font-sans border-b border-[#2B313A] text-[10px]">
                  <th className="py-2 px-2">Coin</th>
                  <th className="py-2 px-2 text-right">Total Balance</th>
                  <th className="py-2 px-2 text-right">Available</th>
                  <th className="py-2 px-2 text-right">In Order</th>
                  <th className="py-2 px-2 text-right">USD Value</th>
                  <th className="py-2 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2B313A]/40">
                {assets.map((asset) => (
                  <tr key={asset.coin} className="hover:bg-[#2B313A]/40 transition-colors">
                    <td className="py-2.5 px-2 flex items-center gap-2">
                      <CryptoIcon symbol={asset.coin} size={18} />
                      <div className="flex flex-col">
                        <span className="font-bold text-[#EAECEF]">{asset.coin}</span>
                        <span className="text-[10px] text-[#848E9C] font-sans">{asset.name}</span>
                      </div>
                    </td>
                    <td className="py-2.5 px-2 text-right font-medium text-[#EAECEF]">
                      {formatAmount(asset.total, 4)}
                    </td>
                    <td className="py-2.5 px-2 text-right text-[#0ECB81]">
                      {formatAmount(asset.available, 4)}
                    </td>
                    <td className="py-2.5 px-2 text-right text-[#848E9C]">
                      {formatAmount(asset.inOrder, 4)}
                    </td>
                    <td className="py-2.5 px-2 text-right text-[#EAECEF]">
                      ${formatPrice(asset.usdValue, 2)}
                    </td>
                    <td className="py-2.5 px-4 text-right">
                      <button
                        onClick={() => depositDemoFunds(asset.coin, asset.coin === 'USDT' ? 2000 : 0.5)}
                        className="text-[#FCD535] hover:text-[#F0B90B] px-1.5 py-0.5 rounded hover:bg-[#2B313A] transition-colors"
                      >
                        + Top-up
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 5: BOTS */}
        {activeTab === 'BOTS' && (
          <div className="h-32 flex flex-col items-center justify-center text-[#848E9C] gap-2 p-4">
            <span className="font-medium text-[#EAECEF]">Spot Grid Trading Bot</span>
            <span className="text-center text-[11px] max-w-md">
              Automate buy low and sell high 24/7 on volatile price ranges. Select price bounds and grid count to launch your strategy.
            </span>
            <button
              onClick={() => setActiveModal('NOTIFICATIONS')}
              className="mt-1 px-3 py-1 bg-[#2B313A] hover:bg-[#FCD535] hover:text-[#0E0E0E] text-[#EAECEF] rounded font-medium transition-colors"
            >
              Configure Grid Strategy
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
