import { MarketPair, Candle, OrderBookRow, AssetBalance, RecentTrade } from '../types/crypto';

export const INITIAL_PAIRS: MarketPair[] = [
  {
    id: 'BTC-USDT',
    symbol: 'BTC/USDT',
    base: 'BTC',
    quote: 'USDT',
    lastPrice: 67842.50,
    prevPrice: 66250.00,
    priceChange: 1592.50,
    priceChangePercent: 2.40,
    high24h: 68450.00,
    low24h: 65910.20,
    volume24h: 28419.45,
    turnover24h: 1928401920.50,
    precisionPrice: 2,
    precisionAmount: 4,
    minAmount: 0.0001,
    isFavorite: true,
    category: 'Hot',
    iconColor: '#F7931A',
  },
  {
    id: 'ETH-USDT',
    symbol: 'ETH/USDT',
    base: 'ETH',
    quote: 'USDT',
    lastPrice: 3540.80,
    prevPrice: 3410.00,
    priceChange: 130.80,
    priceChangePercent: 3.84,
    high24h: 3585.00,
    low24h: 3380.10,
    volume24h: 184512.20,
    turnover24h: 653341000.20,
    precisionPrice: 2,
    precisionAmount: 4,
    minAmount: 0.001,
    isFavorite: true,
    category: 'Hot',
    iconColor: '#627EEA',
  },
  {
    id: 'SOL-USDT',
    symbol: 'SOL/USDT',
    base: 'SOL',
    quote: 'USDT',
    lastPrice: 154.65,
    prevPrice: 148.20,
    priceChange: 6.45,
    priceChangePercent: 4.35,
    high24h: 158.90,
    low24h: 146.50,
    volume24h: 849204.10,
    turnover24h: 131334400.00,
    precisionPrice: 2,
    precisionAmount: 2,
    minAmount: 0.01,
    isFavorite: true,
    category: 'Layer 1',
    iconColor: '#14F195',
  },
  {
    id: 'BNB-USDT',
    symbol: 'BNB/USDT',
    base: 'BNB',
    quote: 'USDT',
    lastPrice: 592.30,
    prevPrice: 588.00,
    priceChange: 4.30,
    priceChangePercent: 0.73,
    high24h: 598.00,
    low24h: 584.20,
    volume24h: 312040.50,
    turnover24h: 184820300.00,
    precisionPrice: 2,
    precisionAmount: 3,
    minAmount: 0.01,
    isFavorite: true,
    category: 'Hot',
    iconColor: '#F0B90B',
  },
  {
    id: 'DOGE-USDT',
    symbol: 'DOGE/USDT',
    base: 'DOGE',
    quote: 'USDT',
    lastPrice: 0.1428,
    prevPrice: 0.1490,
    priceChange: -0.0062,
    priceChangePercent: -4.16,
    high24h: 0.1520,
    low24h: 0.1380,
    volume24h: 142050012.00,
    turnover24h: 20284751.00,
    precisionPrice: 4,
    precisionAmount: 0,
    minAmount: 1,
    isFavorite: false,
    category: 'Meme',
    iconColor: '#C2A633',
  },
  {
    id: 'XRP-USDT',
    symbol: 'XRP/USDT',
    base: 'XRP',
    quote: 'USDT',
    lastPrice: 0.5842,
    prevPrice: 0.5790,
    priceChange: 0.0052,
    priceChangePercent: 0.90,
    high24h: 0.5940,
    low24h: 0.5710,
    volume24h: 98450120.00,
    turnover24h: 57514500.00,
    precisionPrice: 4,
    precisionAmount: 1,
    minAmount: 1,
    isFavorite: false,
    category: 'Layer 1',
    iconColor: '#23292F',
  },
  {
    id: 'AVAX-USDT',
    symbol: 'AVAX/USDT',
    base: 'AVAX',
    quote: 'USDT',
    lastPrice: 28.94,
    prevPrice: 29.80,
    priceChange: -0.86,
    priceChangePercent: -2.89,
    high24h: 30.20,
    low24h: 28.10,
    volume24h: 3840192.00,
    turnover24h: 111135000.00,
    precisionPrice: 2,
    precisionAmount: 2,
    minAmount: 0.1,
    isFavorite: false,
    category: 'Layer 1',
    iconColor: '#E84142',
  },
  {
    id: 'PEPE-USDT',
    symbol: 'PEPE/USDT',
    base: 'PEPE',
    quote: 'USDT',
    lastPrice: 0.00000942,
    prevPrice: 0.00000880,
    priceChange: 0.00000062,
    priceChangePercent: 7.05,
    high24h: 0.00000985,
    low24h: 0.00000850,
    volume24h: 18450928345.00,
    turnover24h: 173807745.00,
    precisionPrice: 8,
    precisionAmount: 0,
    minAmount: 1000,
    isFavorite: false,
    category: 'Meme',
    iconColor: '#439B38',
  }
];

export const INITIAL_ASSETS: AssetBalance[] = [
  {
    coin: 'USDT',
    name: 'Tether USD',
    total: 179610.21,
    available: 176610.21,
    inOrder: 3000.00,
    btcValue: 2.6474,
    usdValue: 179610.21,
    iconColor: '#26A17B',
  },
  {
    coin: 'BTC',
    name: 'Bitcoin',
    total: 0.8450,
    available: 0.8450,
    inOrder: 0.0000,
    btcValue: 0.8450,
    usdValue: 57326.91,
    iconColor: '#F7931A',
  },
  {
    coin: 'ETH',
    name: 'Ethereum',
    total: 3.4200,
    available: 3.4200,
    inOrder: 0.0000,
    btcValue: 0.1785,
    usdValue: 12109.53,
    iconColor: '#627EEA',
  },
  {
    coin: 'BNB',
    name: 'BNB',
    total: 10.5000,
    available: 10.5000,
    inOrder: 0.0000,
    btcValue: 0.0917,
    usdValue: 6219.15,
    iconColor: '#F0B90B',
  },
  {
    coin: 'SOL',
    name: 'Solana',
    total: 35.0000,
    available: 35.0000,
    inOrder: 0.0000,
    btcValue: 0.0798,
    usdValue: 5412.75,
    iconColor: '#14F195',
  }
];

/**
 * Generates past realistic candles for a given base price and count
 */
export function generateInitialCandles(basePrice: number, count: number = 80, timeframe: string = '15m'): Candle[] {
  const candles: Candle[] = [];
  const now = Date.now();
  let intervalMs = 15 * 60 * 1000;
  if (timeframe === '1s') intervalMs = 1000;
  if (timeframe === '1h') intervalMs = 60 * 60 * 1000;
  if (timeframe === '4h') intervalMs = 4 * 60 * 60 * 1000;
  if (timeframe === '1D') intervalMs = 24 * 60 * 60 * 1000;

  let currentPrice = basePrice * 0.94; // start slightly lower to simulate uptrend

  for (let i = count; i >= 0; i--) {
    const time = now - i * intervalMs;
    const volatility = basePrice * 0.004;
    const change = (Math.random() - 0.48) * volatility;
    const open = currentPrice;
    const close = Math.max(open + change, basePrice * 0.5);
    const high = Math.max(open, close) + Math.random() * volatility * 0.8;
    const low = Math.min(open, close) - Math.random() * volatility * 0.8;
    const volume = (Math.random() * 8 + 2) * (basePrice > 1000 ? 5 : 500);

    candles.push({
      time,
      open: Number(open.toFixed(basePrice < 1 ? 6 : 2)),
      high: Number(high.toFixed(basePrice < 1 ? 6 : 2)),
      low: Number(low.toFixed(basePrice < 1 ? 6 : 2)),
      close: Number(close.toFixed(basePrice < 1 ? 6 : 2)),
      volume: Number(volume.toFixed(2)),
    });

    currentPrice = close;
  }

  // Anchor the very last candle's close to basePrice
  const last = candles[candles.length - 1];
  last.close = basePrice;
  last.high = Math.max(last.high, basePrice);
  last.low = Math.min(last.low, basePrice);

  return candles;
}

/**
 * Generates Asks and Bids for an OrderBook centered on midPrice
 */
export function generateOrderBook(midPrice: number, precision: number = 2): { asks: OrderBookRow[]; bids: OrderBookRow[] } {
  const depth = 16;
  const tickSize = Math.max(Math.pow(10, -precision), midPrice * 0.0001);
  const asks: OrderBookRow[] = [];
  const bids: OrderBookRow[] = [];

  let cumAsk = 0;
  let cumBid = 0;

  // Asks (higher than midPrice)
  for (let i = 1; i <= depth; i++) {
    const price = midPrice + i * tickSize * (1 + Math.random() * 0.5);
    const amount = (Math.random() * 1.8 + 0.1) * (midPrice > 1000 ? 1 : 200);
    const total = price * amount;
    cumAsk += amount;
    asks.push({
      price: Number(price.toFixed(precision)),
      amount: Number(amount.toFixed(4)),
      total: Number(total.toFixed(2)),
      cumulative: cumAsk,
      depthPercent: 0, // calculated after
    });
  }

  // Bids (lower than midPrice)
  for (let i = 1; i <= depth; i++) {
    const price = midPrice - i * tickSize * (1 + Math.random() * 0.5);
    const amount = (Math.random() * 1.8 + 0.1) * (midPrice > 1000 ? 1 : 200);
    const total = price * amount;
    cumBid += amount;
    bids.push({
      price: Number(price.toFixed(precision)),
      amount: Number(amount.toFixed(4)),
      total: Number(total.toFixed(2)),
      cumulative: cumBid,
      depthPercent: 0,
    });
  }

  const maxCumAsk = asks[asks.length - 1]?.cumulative || 1;
  const maxCumBid = bids[bids.length - 1]?.cumulative || 1;
  const maxVolume = Math.max(maxCumAsk, maxCumBid);

  asks.forEach((row) => {
    row.depthPercent = Math.min(100, Math.round((row.cumulative / maxVolume) * 100));
  });

  bids.forEach((row) => {
    row.depthPercent = Math.min(100, Math.round((row.cumulative / maxVolume) * 100));
  });

  return {
    asks: asks.reverse(), // Asks shown highest at top down to lowest closest to spread
    bids,
  };
}

/**
 * Generates initial recent market trades
 */
export function generateInitialTrades(midPrice: number, count: number = 25): RecentTrade[] {
  const trades: RecentTrade[] = [];
  const now = Date.now();

  for (let i = 0; i < count; i++) {
    const offset = (Math.random() - 0.5) * (midPrice * 0.001);
    const price = midPrice + offset;
    const isBuyerMaker = Math.random() > 0.5;
    const amount = (Math.random() * 1.5 + 0.05) * (midPrice > 1000 ? 1 : 150);

    trades.push({
      id: `trade-${now - i * 1500}-${Math.random().toString(36).substring(2, 6)}`,
      price: Number(price.toFixed(midPrice < 1 ? 6 : 2)),
      amount: Number(amount.toFixed(4)),
      time: now - i * 1200,
      isBuyerMaker,
    });
  }

  return trades;
}
