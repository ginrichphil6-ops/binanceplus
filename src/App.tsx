import React, { useState } from 'react';
import { TradingProvider, useTrading } from './context/TradingContext';
import { LoginPage } from './components/Auth/LoginPage';
import { HomeScreen } from './components/Home/HomeScreen';
import { MarketsScreen } from './components/Markets/MarketsScreen';
import { FuturesScreen } from './components/Futures/FuturesScreen';
import { AssetsScreen } from './components/Assets/AssetsScreen';
import { BottomTabBar } from './components/Navigation/BottomTabBar';
import { Navbar } from './components/Header/Navbar';
import { TickerHeader } from './components/Ticker/TickerHeader';
import { TradingViewChart } from './components/Chart/TradingViewChart';
import { OrderBook } from './components/OrderBook/OrderBook';
import { MarketTrades } from './components/Trades/MarketTrades';
import { OrderEntry } from './components/TradingTerminal/OrderEntry';
import { UserOrdersPanel } from './components/BottomPanel/UserOrdersPanel';
import { MarketsDrawer } from './components/Modals/MarketsDrawer';
import { DepositModal } from './components/Modals/DepositModal';
import { WithdrawModal } from './components/Modals/WithdrawModal';
import { UserProfileModal } from './components/Modals/UserProfileModal';
import { NotificationDrawer } from './components/Modals/NotificationDrawer';
import { LiveChatModal } from './components/Modals/LiveChatModal';
import { FloatingChatButton } from './components/Navigation/FloatingChatButton';
import { Smartphone, Monitor, LogOut } from 'lucide-react';

function ProTradeTerminal() {
  return (
    <div className="flex-1 min-h-0 flex flex-col xl:flex-row overflow-hidden">
      {/* Left Column: Order Book & Market Trades */}
      <div className="w-full xl:w-[280px] 2xl:w-[310px] shrink-0 h-[380px] xl:h-full flex flex-col border-b xl:border-b-0 xl:border-r border-[#2B313A] bg-[#181A20] overflow-hidden">
        <div className="h-[60%] border-b border-[#2B313A] overflow-hidden">
          <OrderBook />
        </div>
        <div className="h-[40%] overflow-hidden">
          <MarketTrades />
        </div>
      </div>

      {/* Center Column: Interactive TradingView Candlestick Chart & Bottom Orders Ledger */}
      <div className="flex-1 min-w-0 flex flex-col h-full overflow-hidden">
        {/* Top Center: Chart Viewport */}
        <div className="h-[420px] xl:h-[62%] min-h-[300px] w-full relative overflow-hidden">
          <TradingViewChart />
        </div>

        {/* Bottom Center: User Open Orders, History & Assets */}
        <div className="flex-1 min-h-[220px] w-full border-t border-[#2B313A] overflow-hidden">
          <UserOrdersPanel />
        </div>
      </div>

      {/* Right Column: Order Placement Terminal */}
      <div className="w-full xl:w-[320px] 2xl:w-[350px] shrink-0 h-[480px] xl:h-full border-t xl:border-t-0 xl:border-l border-[#2B313A] bg-[#181A20] flex flex-col overflow-hidden">
        <OrderEntry />
      </div>
    </div>
  );
}

function MainApp() {
  const { currentTab, setCurrentTab, setActiveModal, logout } = useTrading();
  const [deviceFrameMode, setDeviceFrameMode] = useState<'AUTO' | 'PHONE'>('AUTO');

  return (
    <div className="flex flex-col h-screen w-screen bg-[#0E1015] text-[#EAECEF] overflow-hidden select-none">
      {/* Optional Top Device Mode Bar (when on wide screens) */}
      <div className="hidden lg:flex items-center justify-between px-4 py-1.5 bg-[#121418] border-b border-[#2B313A] text-xs text-[#848E9C]">
        <div className="flex items-center gap-2">
          <span className="font-bold text-[#EAECEF] tracking-tight">BINANCE</span>
          <span>·</span>
          <span>Official App</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setDeviceFrameMode(deviceFrameMode === 'PHONE' ? 'AUTO' : 'PHONE')}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#1E2329] hover:bg-[#2B313A] text-[#EAECEF] border border-[#2B313A] transition-colors"
            title="Toggle between Mobile App Frame and Fullscreen Responsive"
          >
            {deviceFrameMode === 'PHONE' ? <Monitor size={13} /> : <Smartphone size={13} />}
            <span>{deviceFrameMode === 'PHONE' ? 'Full Width View' : 'Mobile Frame View'}</span>
          </button>

          <button
            onClick={logout}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#F6465D]/10 hover:bg-[#F6465D]/20 text-[#F6465D] border border-[#F6465D]/30 transition-colors"
            title="Log out and return to Black & Yellow Login Page"
          >
            <LogOut size={12} />
            <span>Switch / Log Out</span>
          </button>
        </div>
      </div>

      {/* Application Body */}
      <div className="flex-1 flex justify-center overflow-hidden">
        <div
          className={`relative flex flex-col h-full bg-[#181A20] overflow-hidden transition-all duration-300 ${
            deviceFrameMode === 'PHONE'
              ? 'w-full max-w-[420px] border-x border-[#2B313A] shadow-2xl my-auto h-[95vh] rounded-2xl'
              : 'w-full'
          }`}
        >
          {/* Content based on Active Tab */}
          {currentTab === 'HOME' && <HomeScreen />}

          {currentTab === 'MARKETS' && <MarketsScreen />}

          {currentTab === 'TRADE' && (
            <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
              <TickerHeader />
              <ProTradeTerminal />
            </div>
          )}

          {currentTab === 'FUTURES' && <FuturesScreen />}

          {currentTab === 'ASSETS' && <AssetsScreen />}

          {/* Bottom Tab Bar (Fixed at bottom on all screens) */}
          <BottomTabBar />

          {/* Floating Live Chat Button docked right above bottom tab bar */}
          <FloatingChatButton />
        </div>
      </div>

      {/* Global Modals */}
      <MarketsDrawer />
      <DepositModal />
      <WithdrawModal />
      <UserProfileModal />
      <NotificationDrawer />
      <LiveChatModal />
    </div>
  );
}

function RootApp() {
  const { isAuthenticated } = useTrading();

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return <MainApp />;
}

export default function App() {
  return (
    <TradingProvider>
      <RootApp />
    </TradingProvider>
  );
}

