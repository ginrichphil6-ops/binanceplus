import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import {
  MarketPair,
  Candle,
  OrderBookRow,
  RecentTrade,
  Order,
  AssetBalance,
  ChartTimeframe,
  ChartType,
  OrderSide,
  OrderType,
  MarginMode,
  AppTab,
  UserProfile,
} from '../types/crypto';
import {
  INITIAL_PAIRS,
  INITIAL_ASSETS,
  generateInitialCandles,
  generateOrderBook,
  generateInitialTrades,
} from '../utils/mockData';
import { soundManager } from '../utils/audio';

interface TradingContextType {
  pairs: MarketPair[];
  activePair: MarketPair;
  candles: Candle[];
  timeframe: ChartTimeframe;
  chartType: ChartType;
  orderBook: { asks: OrderBookRow[]; bids: OrderBookRow[] };
  recentTrades: RecentTrade[];
  lastPrice: number;
  prevPrice: number;
  priceDirection: 'UP' | 'DOWN' | 'EQUAL';
  precisionGrouping: number;
  bookMode: 'BOTH' | 'ASKS' | 'BIDS';
  openOrders: Order[];
  orderHistory: Order[];
  tradeHistory: Order[];
  assets: AssetBalance[];
  soundEnabled: boolean;
  selectedPriceInput: number | null;
  activeModal: 'DEPOSIT' | 'WITHDRAW' | 'MARKETS' | 'USER_PROFILE' | 'NOTIFICATIONS' | 'LIVE_CHAT' | null;
  notificationCount: number;
  currentTab: AppTab;
  homeMode: 'EXCHANGE' | 'WALLET';
  balanceMode: 'SCREENSHOT' | 'ACTUAL';
  balanceHidden: boolean;
  isAuthenticated: boolean;
  currentUser: UserProfile;

  // Actions
  setCurrentTab: (tab: AppTab) => void;
  setHomeMode: (mode: 'EXCHANGE' | 'WALLET') => void;
  setBalanceMode: (mode: 'SCREENSHOT' | 'ACTUAL') => void;
  setBalanceHidden: (hidden: boolean) => void;
  login: (username: string, password: string) => { success: boolean; message: string };
  logout: () => void;
  setActivePairById: (id: string) => void;
  setTimeframe: (tf: ChartTimeframe) => void;
  setChartType: (ct: ChartType) => void;
  setPrecisionGrouping: (p: number) => void;
  setBookMode: (mode: 'BOTH' | 'ASKS' | 'BIDS') => void;
  toggleSound: () => void;
  setSelectedPriceInput: (p: number | null) => void;
  setActiveModal: (m: 'DEPOSIT' | 'WITHDRAW' | 'MARKETS' | 'USER_PROFILE' | 'NOTIFICATIONS' | 'LIVE_CHAT' | null) => void;
  toggleFavoritePair: (id: string) => void;
  placeOrder: (params: {
    side: OrderSide;
    type: OrderType;
    price: number;
    amount: number;
    marginMode: MarginMode;
  }) => { success: boolean; message: string };
  cancelOrder: (id: string) => void;
  cancelAllOrders: () => void;
  depositDemoFunds: (coin: string, amount: number) => void;
  withdrawDemoFunds: (coin: string, amount: number) => { success: boolean; message: string };
  resetDemoAccount: () => void;
}

const TradingContext = createContext<TradingContextType | undefined>(undefined);

export const TradingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [pairs, setPairs] = useState<MarketPair[]>(INITIAL_PAIRS);
  const [activePair, setActivePair] = useState<MarketPair>(INITIAL_PAIRS[0]);
  const [timeframe, setTimeframe] = useState<ChartTimeframe>('15m');
  const [chartType, setChartType] = useState<ChartType>('CANDLE');
  const [candles, setCandles] = useState<Candle[]>(() =>
    generateInitialCandles(INITIAL_PAIRS[0].lastPrice, 80, '15m')
  );
  const [orderBook, setOrderBook] = useState<{ asks: OrderBookRow[]; bids: OrderBookRow[] }>(() =>
    generateOrderBook(INITIAL_PAIRS[0].lastPrice, INITIAL_PAIRS[0].precisionPrice)
  );
  const [recentTrades, setRecentTrades] = useState<RecentTrade[]>(() =>
    generateInitialTrades(INITIAL_PAIRS[0].lastPrice, 25)
  );
  const [lastPrice, setLastPrice] = useState<number>(INITIAL_PAIRS[0].lastPrice);
  const [prevPrice, setPrevPrice] = useState<number>(INITIAL_PAIRS[0].prevPrice);
  const [priceDirection, setPriceDirection] = useState<'UP' | 'DOWN' | 'EQUAL'>('UP');
  const [precisionGrouping, setPrecisionGrouping] = useState<number>(INITIAL_PAIRS[0].precisionPrice);
  const [bookMode, setBookMode] = useState<'BOTH' | 'ASKS' | 'BIDS'>('BOTH');

  // User account state
  const [assets, setAssets] = useState<AssetBalance[]>(INITIAL_ASSETS);
  const [openOrders, setOpenOrders] = useState<Order[]>([
    {
      id: 'ord-init-1',
      pair: 'BTC/USDT',
      side: 'BUY',
      type: 'LIMIT',
      price: 66500.00,
      amount: 0.1500,
      filled: 0,
      total: 9975.00,
      status: 'NEW',
      timestamp: Date.now() - 3600000,
    },
    {
      id: 'ord-init-2',
      pair: 'BTC/USDT',
      side: 'SELL',
      type: 'LIMIT',
      price: 69200.00,
      amount: 0.1000,
      filled: 0,
      total: 6920.00,
      status: 'NEW',
      timestamp: Date.now() - 7200000,
    }
  ]);
  const [orderHistory, setOrderHistory] = useState<Order[]>([
    {
      id: 'ord-hist-1',
      pair: 'BTC/USDT',
      side: 'BUY',
      type: 'MARKET',
      price: 66820.00,
      amount: 0.2500,
      filled: 0.2500,
      total: 16705.00,
      status: 'FILLED',
      timestamp: Date.now() - 86400000,
    },
    {
      id: 'ord-hist-2',
      pair: 'ETH/USDT',
      side: 'BUY',
      type: 'LIMIT',
      price: 3420.00,
      amount: 1.5000,
      filled: 1.5000,
      total: 5130.00,
      status: 'FILLED',
      timestamp: Date.now() - 172800000,
    }
  ]);
  const [tradeHistory, setTradeHistory] = useState<Order[]>([
    {
      id: 'th-1',
      pair: 'BTC/USDT',
      side: 'BUY',
      type: 'MARKET',
      price: 66820.00,
      amount: 0.2500,
      filled: 0.2500,
      total: 16705.00,
      status: 'FILLED',
      timestamp: Date.now() - 86400000,
    }
  ]);

  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [selectedPriceInput, setSelectedPriceInput] = useState<number | null>(null);
  const [activeModal, setActiveModal] = useState<'DEPOSIT' | 'WITHDRAW' | 'MARKETS' | 'USER_PROFILE' | 'NOTIFICATIONS' | 'LIVE_CHAT' | null>(null);
  const [notificationCount, setNotificationCount] = useState<number>(3);
  const [currentTab, setCurrentTab] = useState<AppTab>('HOME');
  const [homeMode, setHomeMode] = useState<'EXCHANGE' | 'WALLET'>('EXCHANGE');
  const [balanceMode, setBalanceMode] = useState<'SCREENSHOT' | 'ACTUAL'>('SCREENSHOT');
  const [balanceHidden, setBalanceHidden] = useState<boolean>(false);

  // Authentication State (default to false on fresh visit so user can test the login page)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      return localStorage.getItem('binance_authenticated_user') === 'true';
    } catch {
      return false;
    }
  });

  const [currentUser, setCurrentUser] = useState<UserProfile>({
    username: 'DiannePizallo88',
    name: 'Dianne Pizallo',
    email: 'diannepizallo88@gmail.com',
    userId: '89342019',
    vipLevel: 'VIP 0',
    kycStatus: 'Verified',
    avatarInitials: 'DP',
  });

  const login = useCallback((userVal: string, passVal: string) => {
    const rawUser = userVal.trim();
    const normUser = rawUser.toLowerCase();
    
    // Check user: DiannePizallo88 (supports DiannePizallo88, email, or dianne)
    const validUsernames = [
      'diannepizallo88',
      'diannepizallo88@gmail.com',
      'diannepizallo88@binance.com',
      'diannepizallo',
      'dianne'
    ];
    const isUserValid = validUsernames.includes(normUser);
    
    // Check password: Merrypizallo#00
    const isPassValid = passVal === 'Merrypizallo#00';

    if (isUserValid && isPassValid) {
      setIsAuthenticated(true);
      setCurrentTab('HOME');
      try {
        localStorage.setItem('binance_authenticated_user', 'true');
      } catch {}
      soundManager.playOrderPlaced();
      return {
        success: true,
        message: 'Welcome back, Dianne Pizallo! Authentication successful.',
      };
    }

    if (!isUserValid && !isPassValid) {
      return {
        success: false,
        message: 'Incorrect User Name and Password. Please use DiannePizallo88 & Merrypizallo#00.',
      };
    }
    if (!isUserValid) {
      return {
        success: false,
        message: 'User Name not recognized. Please enter DiannePizallo88.',
      };
    }
    return {
      success: false,
      message: 'Incorrect password for DiannePizallo88. Expected Merrypizallo#00.',
    };
  }, []);

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    setActiveModal(null);
    try {
      localStorage.removeItem('binance_authenticated_user');
    } catch {}
  }, []);

  // References for ticker simulation
  const lastPriceRef = useRef(lastPrice);
  lastPriceRef.current = lastPrice;
  const activePairRef = useRef(activePair);
  activePairRef.current = activePair;
  const openOrdersRef = useRef(openOrders);
  openOrdersRef.current = openOrders;
  const assetsRef = useRef(assets);
  assetsRef.current = assets;

  // Toggle sound
  const toggleSound = useCallback(() => {
    setSoundEnabled((prev) => {
      const next = !prev;
      soundManager.enabled = next;
      return next;
    });
  }, []);

  // Set active pair
  const setActivePairById = useCallback((id: string) => {
    const pair = pairs.find((p) => p.id === id);
    if (!pair) return;
    setActivePair(pair);
    setLastPrice(pair.lastPrice);
    setPrevPrice(pair.prevPrice);
    setPrecisionGrouping(pair.precisionPrice);
    setSelectedPriceInput(null);

    // Regenerate candles & orderbook for the selected pair
    const newCandles = generateInitialCandles(pair.lastPrice, 80, timeframe);
    setCandles(newCandles);
    setOrderBook(generateOrderBook(pair.lastPrice, pair.precisionPrice));
    setRecentTrades(generateInitialTrades(pair.lastPrice, 25));
  }, [pairs, timeframe]);

  // Toggle favorite pair
  const toggleFavoritePair = useCallback((id: string) => {
    setPairs((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isFavorite: !p.isFavorite } : p))
    );
  }, []);

  // When timeframe changes, generate matching candles
  useEffect(() => {
    setCandles(generateInitialCandles(activePair.lastPrice, 80, timeframe));
  }, [timeframe, activePair.id]);

  // Execute an open order that was matched
  const executeMatchedOrder = useCallback((order: Order, matchPrice: number) => {
    soundManager.playOrderFilled();
    const [baseCoin, quoteCoin] = order.pair.split('/');

    setOpenOrders((prev) => prev.filter((o) => o.id !== order.id));

    const filledOrder: Order = {
      ...order,
      price: matchPrice,
      filled: order.amount,
      total: matchPrice * order.amount,
      status: 'FILLED',
      timestamp: Date.now(),
    };

    setOrderHistory((prev) => [filledOrder, ...prev]);
    setTradeHistory((prev) => [filledOrder, ...prev]);
    setNotificationCount((n) => n + 1);

    // Update wallet balances
    setAssets((prev) => {
      return prev.map((asset) => {
        if (order.side === 'BUY') {
          // Quote was locked inOrder, now deduct total quote, add base
          if (asset.coin === quoteCoin) {
            const inOrderRemaining = Math.max(0, asset.inOrder - order.total);
            const totalRemaining = asset.total - (matchPrice * order.amount);
            return {
              ...asset,
              total: totalRemaining,
              inOrder: inOrderRemaining,
              usdValue: totalRemaining,
            };
          }
          if (asset.coin === baseCoin) {
            const total = asset.total + order.amount;
            const available = asset.available + order.amount;
            return {
              ...asset,
              total,
              available,
              usdValue: total * matchPrice,
            };
          }
        } else {
          // SELL: Base was inOrder, deduct base, credit quote
          if (asset.coin === baseCoin) {
            const inOrderRemaining = Math.max(0, asset.inOrder - order.amount);
            const totalRemaining = asset.total - order.amount;
            return {
              ...asset,
              total: totalRemaining,
              inOrder: inOrderRemaining,
              usdValue: totalRemaining * matchPrice,
            };
          }
          if (asset.coin === quoteCoin) {
            const received = matchPrice * order.amount;
            const total = asset.total + received;
            const available = asset.available + received;
            return {
              ...asset,
              total,
              available,
              usdValue: total,
            };
          }
        }
        return asset;
      });
    });
  }, []);

  // Main real-time simulation tick engine
  useEffect(() => {
    const interval = setInterval(() => {
      const current = lastPriceRef.current;
      const pair = activePairRef.current;
      const volatility = current * (pair.lastPrice > 1000 ? 0.0003 : 0.001);
      // Random walk with mean reversion
      const drift = (Math.random() - 0.495) * volatility;
      const newPriceNum = Math.max(current + drift, 0.00000001);
      const formattedPrice = Number(newPriceNum.toFixed(pair.precisionPrice));

      const dir = formattedPrice > current ? 'UP' : formattedPrice < current ? 'DOWN' : 'EQUAL';
      setPriceDirection(dir);
      setPrevPrice(current);
      setLastPrice(formattedPrice);

      // Check if any open Limit orders are crossed
      const currentOrders = openOrdersRef.current;
      currentOrders.forEach((ord) => {
        if (ord.pair === pair.symbol && ord.status === 'NEW') {
          if (ord.side === 'BUY' && formattedPrice <= ord.price) {
            executeMatchedOrder(ord, ord.price);
          } else if (ord.side === 'SELL' && formattedPrice >= ord.price) {
            executeMatchedOrder(ord, ord.price);
          }
        }
      });

      // Update the active pair in pairs list
      setPairs((prev) =>
        prev.map((p) => {
          if (p.id === pair.id) {
            const priceChange = formattedPrice - p.prevPrice;
            const priceChangePercent = Number(((priceChange / p.prevPrice) * 100).toFixed(2));
            const high24h = Math.max(p.high24h, formattedPrice);
            const low24h = Math.min(p.low24h, formattedPrice);
            const newVol = p.volume24h + (Math.random() * 0.5 + 0.01) * (pair.lastPrice > 1000 ? 1 : 200);
            return {
              ...p,
              lastPrice: formattedPrice,
              priceChange,
              priceChangePercent,
              high24h,
              low24h,
              volume24h: Number(newVol.toFixed(2)),
              turnover24h: Number((newVol * formattedPrice).toFixed(2)),
            };
          }
          return p;
        })
      );

      // Update active pair state
      setActivePair((prev) => {
        const priceChange = formattedPrice - prev.prevPrice;
        const priceChangePercent = Number(((priceChange / prev.prevPrice) * 100).toFixed(2));
        return {
          ...prev,
          lastPrice: formattedPrice,
          priceChange,
          priceChangePercent,
          high24h: Math.max(prev.high24h, formattedPrice),
          low24h: Math.min(prev.low24h, formattedPrice),
        };
      });

      // Update Candle stream
      setCandles((prev) => {
        if (!prev.length) return prev;
        const lastCandle = { ...prev[prev.length - 1] };
        lastCandle.close = formattedPrice;
        lastCandle.high = Math.max(lastCandle.high, formattedPrice);
        lastCandle.low = Math.min(lastCandle.low, formattedPrice);
        lastCandle.volume = Number((lastCandle.volume + (Math.random() * 0.4)).toFixed(2));

        return [...prev.slice(0, prev.length - 1), lastCandle];
      });

      // Add a trade into recentTrades
      const tradeAmount = Number(((Math.random() * 0.8 + 0.02) * (pair.lastPrice > 1000 ? 1 : 120)).toFixed(pair.precisionAmount));
      const newTrade: RecentTrade = {
        id: `t-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
        price: formattedPrice,
        amount: tradeAmount,
        time: Date.now(),
        isBuyerMaker: dir === 'DOWN',
      };
      setRecentTrades((prev) => [newTrade, ...prev.slice(0, 35)]);

      // Dynamically update Order Book around newPrice
      setOrderBook(generateOrderBook(formattedPrice, pair.precisionPrice));
    }, 650);

    return () => clearInterval(interval);
  }, [executeMatchedOrder]);

  // Place a new order
  const placeOrder = useCallback(
    ({
      side,
      type,
      price,
      amount,
      marginMode,
    }: {
      side: OrderSide;
      type: OrderType;
      price: number;
      amount: number;
      marginMode: MarginMode;
    }): { success: boolean; message: string } => {
      const pair = activePair;
      const baseCoin = pair.base;
      const quoteCoin = pair.quote;

      const execPrice = type === 'MARKET' ? lastPrice : price;
      const totalCost = execPrice * amount;

      // Find user balances
      const quoteAsset = assets.find((a) => a.coin === quoteCoin);
      const baseAsset = assets.find((a) => a.coin === baseCoin);

      if (side === 'BUY') {
        const availableQuote = quoteAsset ? quoteAsset.available : 0;
        if (totalCost > availableQuote) {
          return {
            success: false,
            message: `Insufficient ${quoteCoin} balance! Required: ${totalCost.toFixed(2)} ${quoteCoin}, Available: ${availableQuote.toFixed(2)} ${quoteCoin}`,
          };
        }
      } else {
        const availableBase = baseAsset ? baseAsset.available : 0;
        if (amount > availableBase) {
          return {
            success: false,
            message: `Insufficient ${baseCoin} balance! Required: ${amount} ${baseCoin}, Available: ${availableBase} ${baseCoin}`,
          };
        }
      }

      // Order audio feedback
      soundManager.playOrderPlaced();

      if (type === 'MARKET') {
        // Immediate fill
        const newOrder: Order = {
          id: `ord-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          pair: pair.symbol,
          side,
          type,
          price: execPrice,
          amount,
          filled: amount,
          total: totalCost,
          status: 'FILLED',
          timestamp: Date.now(),
        };

        setOrderHistory((prev) => [newOrder, ...prev]);
        setTradeHistory((prev) => [newOrder, ...prev]);
        soundManager.playOrderFilled();

        // Update Wallet Assets
        setAssets((prev) => {
          let updated = [...prev];
          if (side === 'BUY') {
            // Deduct Quote, add Base
            updated = updated.map((asset) => {
              if (asset.coin === quoteCoin) {
                const total = asset.total - totalCost;
                const available = asset.available - totalCost;
                return { ...asset, total, available, usdValue: total };
              }
              if (asset.coin === baseCoin) {
                const total = asset.total + amount;
                const available = asset.available + amount;
                return { ...asset, total, available, usdValue: total * execPrice };
              }
              return asset;
            });
            // If baseCoin doesn't exist yet, add it
            if (!updated.some((a) => a.coin === baseCoin)) {
              updated.push({
                coin: baseCoin,
                name: baseCoin,
                total: amount,
                available: amount,
                inOrder: 0,
                btcValue: baseCoin === 'BTC' ? amount : 0,
                usdValue: amount * execPrice,
                iconColor: pair.iconColor,
              });
            }
          } else {
            // SELL: Deduct Base, add Quote
            updated = updated.map((asset) => {
              if (asset.coin === baseCoin) {
                const total = asset.total - amount;
                const available = asset.available - amount;
                return { ...asset, total, available, usdValue: total * execPrice };
              }
              if (asset.coin === quoteCoin) {
                const total = asset.total + totalCost;
                const available = asset.available + totalCost;
                return { ...asset, total, available, usdValue: total };
              }
              return asset;
            });
          }
          return updated;
        });

        // Add to recent market trades stream
        setRecentTrades((prev) => [
          {
            id: `usr-${Date.now()}`,
            price: execPrice,
            amount,
            time: Date.now(),
            isBuyerMaker: side === 'SELL',
          },
          ...prev,
        ]);

        return {
          success: true,
          message: `Market order executed: ${side} ${amount} ${baseCoin} at $${execPrice.toFixed(pair.precisionPrice)}`,
        };
      } else {
        // LIMIT or STOP_LIMIT
        const newOrder: Order = {
          id: `ord-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          pair: pair.symbol,
          side,
          type,
          price,
          amount,
          filled: 0,
          total: totalCost,
          status: 'NEW',
          timestamp: Date.now(),
        };

        setOpenOrders((prev) => [newOrder, ...prev]);

        // Lock funds into inOrder
        setAssets((prev) => {
          return prev.map((asset) => {
            if (side === 'BUY' && asset.coin === quoteCoin) {
              return {
                ...asset,
                available: asset.available - totalCost,
                inOrder: asset.inOrder + totalCost,
              };
            }
            if (side === 'SELL' && asset.coin === baseCoin) {
              return {
                ...asset,
                available: asset.available - amount,
                inOrder: asset.inOrder + amount,
              };
            }
            return asset;
          });
        });

        return {
          success: true,
          message: `Limit order placed: ${side} ${amount} ${baseCoin} @ $${price.toFixed(pair.precisionPrice)}`,
        };
      }
    },
    [activePair, assets, lastPrice]
  );

  // Cancel single open order
  const cancelOrder = useCallback(
    (orderId: string) => {
      const order = openOrders.find((o) => o.id === orderId);
      if (!order) return;

      soundManager.playOrderCancelled();

      setOpenOrders((prev) => prev.filter((o) => o.id !== orderId));
      setOrderHistory((prev) => [
        { ...order, status: 'CANCELLED', timestamp: Date.now() },
        ...prev,
      ]);

      // Release locked funds from inOrder back to available
      const [baseCoin, quoteCoin] = order.pair.split('/');
      setAssets((prev) => {
        return prev.map((asset) => {
          if (order.side === 'BUY' && asset.coin === quoteCoin) {
            return {
              ...asset,
              available: asset.available + order.total,
              inOrder: Math.max(0, asset.inOrder - order.total),
            };
          }
          if (order.side === 'SELL' && asset.coin === baseCoin) {
            return {
              ...asset,
              available: asset.available + order.amount,
              inOrder: Math.max(0, asset.inOrder - order.amount),
            };
          }
          return asset;
        });
      });
    },
    [openOrders]
  );

  // Cancel all open orders
  const cancelAllOrders = useCallback(() => {
    if (!openOrders.length) return;
    soundManager.playOrderCancelled();

    openOrders.forEach((o) => {
      const [baseCoin, quoteCoin] = o.pair.split('/');
      setAssets((prev) => {
        return prev.map((asset) => {
          if (o.side === 'BUY' && asset.coin === quoteCoin) {
            return {
              ...asset,
              available: asset.available + o.total,
              inOrder: Math.max(0, asset.inOrder - o.total),
            };
          }
          if (o.side === 'SELL' && asset.coin === baseCoin) {
            return {
              ...asset,
              available: asset.available + o.amount,
              inOrder: Math.max(0, asset.inOrder - o.amount),
            };
          }
          return asset;
        });
      });
    });

    setOrderHistory((prev) => [
      ...openOrders.map((o) => ({ ...o, status: 'CANCELLED' as const, timestamp: Date.now() })),
      ...prev,
    ]);
    setOpenOrders([]);
  }, [openOrders]);

  // Demo deposit faucet
  const depositDemoFunds = useCallback((coin: string, amount: number) => {
    soundManager.playOrderFilled();
    setAssets((prev) => {
      const existing = prev.find((a) => a.coin === coin);
      if (existing) {
        return prev.map((a) =>
          a.coin === coin
            ? {
                ...a,
                total: a.total + amount,
                available: a.available + amount,
                usdValue: (a.total + amount) * (coin === 'USDT' ? 1 : activePair.lastPrice),
              }
            : a
        );
      } else {
        return [
          ...prev,
          {
            coin,
            name: coin,
            total: amount,
            available: amount,
            inOrder: 0,
            btcValue: 0,
            usdValue: amount,
            iconColor: '#FCD535',
          },
        ];
      }
    });
    setNotificationCount((n) => n + 1);
  }, [activePair.lastPrice]);

  // Demo withdraw
  const withdrawDemoFunds = useCallback((coin: string, amount: number) => {
    const existing = assets.find((a) => a.coin === coin);
    const available = existing ? existing.available : 0;

    if (amount > available) {
      return {
        success: false,
        message: `Insufficient funds. Available: ${available.toFixed(4)} ${coin}`,
      };
    }

    soundManager.playOrderCancelled();
    setAssets((prev) =>
      prev.map((a) =>
        a.coin === coin
          ? {
              ...a,
              total: Math.max(0, a.total - amount),
              available: Math.max(0, a.available - amount),
              usdValue: Math.max(0, (a.total - amount) * (coin === 'USDT' ? 1 : activePair.lastPrice)),
            }
          : a
      )
    );
    setNotificationCount((n) => n + 1);
    return {
      success: true,
      message: `Withdrawal request of ${amount} ${coin} submitted successfully!`,
    };
  }, [assets, activePair.lastPrice]);

  // Reset demo account to factory state
  const resetDemoAccount = useCallback(() => {
    setAssets(INITIAL_ASSETS);
    setOpenOrders([]);
    setOrderHistory([]);
    setTradeHistory([]);
    soundManager.playOrderFilled();
  }, []);

  return (
    <TradingContext.Provider
      value={{
        pairs,
        activePair,
        candles,
        timeframe,
        chartType,
        orderBook,
        recentTrades,
        lastPrice,
        prevPrice,
        priceDirection,
        precisionGrouping,
        bookMode,
        openOrders,
        orderHistory,
        tradeHistory,
        assets,
        soundEnabled,
        selectedPriceInput,
        activeModal,
        notificationCount,
        currentTab,
        homeMode,
        balanceMode,
        balanceHidden,
        isAuthenticated,
        currentUser,
        setCurrentTab,
        setHomeMode,
        setBalanceMode,
        setBalanceHidden,
        login,
        logout,
        setActivePairById,
        setTimeframe,
        setChartType,
        setPrecisionGrouping,
        setBookMode,
        toggleSound,
        setSelectedPriceInput,
        setActiveModal,
        toggleFavoritePair,
        placeOrder,
        cancelOrder,
        cancelAllOrders,
        depositDemoFunds,
        withdrawDemoFunds,
        resetDemoAccount,
      }}
    >
      {children}
    </TradingContext.Provider>
  );
};

export const useTrading = () => {
  const context = useContext(TradingContext);
  if (!context) {
    throw new Error('useTrading must be used within a TradingProvider');
  }
  return context;
};
