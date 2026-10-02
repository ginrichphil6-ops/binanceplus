export type OrderSide = 'BUY' | 'SELL';
export type OrderType = 'LIMIT' | 'MARKET' | 'STOP_LIMIT';
export type OrderStatus = 'NEW' | 'PARTIALLY_FILLED' | 'FILLED' | 'CANCELLED';
export type MarginMode = 'SPOT' | 'CROSS_3X' | 'ISOLATED_10X';

export interface MarketPair {
  id: string;
  symbol: string;         // e.g. "BTC/USDT"
  base: string;           // "BTC"
  quote: string;          // "USDT"
  lastPrice: number;
  prevPrice: number;
  priceChange: number;
  priceChangePercent: number;
  high24h: number;
  low24h: number;
  volume24h: number;      // in base asset
  turnover24h: number;    // in quote asset
  precisionPrice: number;
  precisionAmount: number;
  minAmount: number;
  isFavorite?: boolean;
  category: 'Layer 1' | 'Meme' | 'DeFi' | 'AI' | 'Hot';
  iconColor: string;
}

export interface Candle {
  time: number; // timestamp in ms
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface OrderBookRow {
  price: number;
  amount: number;
  total: number;
  cumulative: number;
  depthPercent: number;
}

export interface RecentTrade {
  id: string;
  price: number;
  amount: number;
  time: number;
  isBuyerMaker: boolean; // true = SELL (red), false = BUY (green)
}

export interface Order {
  id: string;
  pair: string;
  side: OrderSide;
  type: OrderType;
  price: number;
  amount: number;
  filled: number;
  total: number;
  status: OrderStatus;
  timestamp: number;
  triggerPrice?: number;
}

export interface AssetBalance {
  coin: string;
  name: string;
  total: number;
  available: number;
  inOrder: number;
  btcValue: number;
  usdValue: number;
  iconColor: string;
}

export type ChartTimeframe = '1s' | '15m' | '1h' | '4h' | '1D';
export type ChartType = 'CANDLE' | 'LINE' | 'DEPTH';
export type AppTab = 'HOME' | 'MARKETS' | 'TRADE' | 'FUTURES' | 'ASSETS';

export interface UserProfile {
  username: string;
  name: string;
  email: string;
  userId: string;
  vipLevel: string;
  kycStatus: string;
  avatarInitials: string;
}
