import React, { useState, useEffect, useRef } from 'react';
import { useTrading } from '../../context/TradingContext';
import {
  X,
  Send,
  Headphones,
  Users,
  ShieldCheck,
  Paperclip,
  Smile,
  Volume2,
  VolumeX,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Flame,
  CheckCheck,
  MessageCircle,
  Copy,
  Check,
  ExternalLink,
  PhoneCall,
  Image as ImageIcon,
} from 'lucide-react';
import { soundManager } from '../../utils/audio';

// Default official WhatsApp VIP support number
const DEFAULT_WHATSAPP_NUMBER = '+1 936 332 3841';
const DEFAULT_WHATSAPP_CLEAN = '19363323841';

interface ChatMessage {
  id: string;
  sender: 'user' | 'agent' | 'system' | 'community';
  senderName?: string;
  senderBadge?: string;
  text: string;
  timestamp: number;
  actionButton?: {
    label: string;
    action: () => void;
  };
  sentiment?: 'BULLISH' | 'BEARISH' | 'NEUTRAL';
  attachmentUrl?: string;
  isWhatsAppCard?: boolean;
  whatsAppNumber?: string;
}

const FAQ_SUGGESTIONS = [
  'Why is my deposit pending?',
  'I need my Withdrawal Auth Key',
  'Connect with WhatsApp Support',
  'How to set Stop-Loss & Take-Profit?',
  'What are the spot trading fee tiers?',
  'Explain Cross vs Isolated margin',
  'How to reset demo funds?',
  'Is 2FA mandatory for withdrawals?',
];

const INITIAL_SUPPORT_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-sup-1',
    sender: 'agent',
    senderName: 'Sophia Vance',
    senderBadge: 'Senior VIP Specialist #BN-8841',
    text: "Hello! Welcome to Binance 24/7 Live Support. I am your automated trading specialist. Ask me anything about orders, deposits, or margin. If you ever need further one-on-one help, I can connect you directly with our dedicated WhatsApp VIP desk!",
    timestamp: Date.now() - 60000,
  },
];

const INITIAL_COMMUNITY_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-com-1',
    sender: 'community',
    senderName: 'Satoshi_Whale',
    senderBadge: 'VIP 5 · Top Trader',
    text: 'BTC holding strong above $67,500. Spot volume looks very healthy on the 4H chart 🚀',
    timestamp: Date.now() - 95000,
    sentiment: 'BULLISH',
  },
  {
    id: 'msg-com-2',
    sender: 'community',
    senderName: 'Elena_Futures',
    senderBadge: 'Pro Scalper',
    text: 'Watching SOL/USDT at 119.50. Looking for an entry on the next retest with tight stop.',
    timestamp: Date.now() - 65000,
    sentiment: 'NEUTRAL',
  },
  {
    id: 'msg-com-3',
    sender: 'community',
    senderName: 'Marco_DeFi',
    senderBadge: 'VIP 2',
    text: 'BNB quarterly token burn metrics just released. Supply reduction is bullish long-term 🔥',
    timestamp: Date.now() - 35000,
    sentiment: 'BULLISH',
  },
  {
    id: 'msg-com-4',
    sender: 'community',
    senderName: 'AlphaTrader_HK',
    senderBadge: 'Algo Bot Runner',
    text: 'Market trades feed is flowing fast today. Keep an eye on funding rates before taking 10x positions.',
    timestamp: Date.now() - 15000,
    sentiment: 'NEUTRAL',
  },
];

const COMMUNITY_STREAM_POOL = [
  {
    senderName: 'CryptoViking',
    senderBadge: 'VIP 3 · Spot Master',
    text: 'Just added more BTC on the dip! Never bet against Bitcoin in an expansion phase 💎🙌',
    sentiment: 'BULLISH' as const,
  },
  {
    senderName: 'Nova_Trades',
    senderBadge: 'Futures Scalper',
    text: 'Order book depth on asks looks heavy around $68,200. Short term consolidation expected.',
    sentiment: 'NEUTRAL' as const,
  },
  {
    senderName: 'Lily_HODL',
    senderBadge: 'Binance Angel',
    text: 'Remember to set Stop-Limit orders if you are stepping away from the charts tonight! Safety first 🛡️',
    sentiment: 'NEUTRAL' as const,
  },
  {
    senderName: 'ApexQuant',
    senderBadge: 'VIP 4',
    text: 'ETH gas is low, layer 2 volumes are surging. Great arbitrage opportunities on spot pairs.',
    sentiment: 'BULLISH' as const,
  },
  {
    senderName: 'BearishBob',
    senderBadge: 'Risk Manager',
    text: 'Watch out for fakeouts near the local high. Taking 30% profit here to stay disciplined 📉',
    sentiment: 'BEARISH' as const,
  },
  {
    senderName: 'ZenTrader',
    senderBadge: 'VIP 1',
    text: 'Binance terminal execution speed today is instant. Chart latency under 15ms ⚡',
    sentiment: 'BULLISH' as const,
  },
];

export const LiveChatModal: React.FC = () => {
  const {
    activeModal,
    setActiveModal,
    activePair,
    setCurrentTab,
    resetDemoAccount,
  } = useTrading();

  const [activeChatTab, setActiveChatTab] = useState<'SUPPORT' | 'COMMUNITY'>('SUPPORT');
  const [supportMessages, setSupportMessages] = useState<ChatMessage[]>(() => INITIAL_SUPPORT_MESSAGES);

  const [communityMessages, setCommunityMessages] = useState<ChatMessage[]>(INITIAL_COMMUNITY_MESSAGES);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [soundMuted, setSoundMuted] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [attachedImage, setAttachedImage] = useState<string | null>(null);
  const [traderCount, setTraderCount] = useState(1482);
  const [copiedWhatsApp, setCopiedWhatsApp] = useState(false);
  const [customWhatsAppNumber, setCustomWhatsAppNumber] = useState(() => {
    const saved = localStorage.getItem('binance_support_whatsapp');
    if (!saved || saved.includes('555')) {
      localStorage.setItem('binance_support_whatsapp', DEFAULT_WHATSAPP_NUMBER);
      return DEFAULT_WHATSAPP_NUMBER;
    }
    return saved;
  });
  const [isEditingWhatsApp, setIsEditingWhatsApp] = useState(false);
  const [tempNumberInput, setTempNumberInput] = useState(customWhatsAppNumber);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Reset live chat to a fresh session each time the modal opens
  useEffect(() => {
    if (activeModal === 'LIVE_CHAT') {
      setSupportMessages(INITIAL_SUPPORT_MESSAGES);
      setInputMessage('');
      setIsTyping(false);
      try {
        localStorage.removeItem('binance_livechat_history');
      } catch {
        // ignore
      }
      scrollToBottom();
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [activeModal]);

  // Periodic community stream simulation
  useEffect(() => {
    if (activeModal !== 'LIVE_CHAT' || activeChatTab !== 'COMMUNITY') return;

    const interval = setInterval(() => {
      const randomMsg = COMMUNITY_STREAM_POOL[Math.floor(Math.random() * COMMUNITY_STREAM_POOL.length)];
      const newCommunityItem: ChatMessage = {
        id: `com-${Date.now()}-${Math.random()}`,
        sender: 'community',
        senderName: randomMsg.senderName,
        senderBadge: randomMsg.senderBadge,
        text: randomMsg.text,
        sentiment: randomMsg.sentiment,
        timestamp: Date.now(),
      };

      setCommunityMessages((prev) => [...prev.slice(-30), newCommunityItem]);
      setTraderCount((prev) => prev + (Math.random() > 0.5 ? 1 : -1));

      if (!soundMuted) {
        soundManager.playMessageReceived();
      }
    }, 7000);

    return () => clearInterval(interval);
  }, [activeModal, activeChatTab, soundMuted]);

  if (activeModal !== 'LIVE_CHAT') return null;

  // Clean phone number for WhatsApp link
  const cleanPhoneForWhatsApp = (phoneStr: string) => {
    return phoneStr.replace(/[^0-9]/g, '');
  };

  const handleOpenWhatsApp = (numToUse?: string) => {
    const rawNumber = cleanPhoneForWhatsApp(numToUse || customWhatsAppNumber) || DEFAULT_WHATSAPP_CLEAN;
    const textPrompt = encodeURIComponent(
      `Hello Binance VIP Support Team, I am contacting you from the trading app for further assistance with my account and orders.`
    );
    const waUrl = `https://wa.me/${rawNumber}?text=${textPrompt}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  const handleCopyWhatsApp = (numToCopy: string) => {
    navigator.clipboard.writeText(numToCopy);
    setCopiedWhatsApp(true);
    setTimeout(() => setCopiedWhatsApp(false), 2000);
  };

  const handleSaveCustomNumber = () => {
    const trimmed = tempNumberInput.trim() || DEFAULT_WHATSAPP_NUMBER;
    setCustomWhatsAppNumber(trimmed);
    localStorage.setItem('binance_support_whatsapp', trimmed);
    setIsEditingWhatsApp(false);
  };

  // Generate automated intelligent response with WhatsApp escalation logic
  const getAutomatedResponse = (
    userText: string
  ): {
    text: string;
    actionButton?: { label: string; action: () => void };
    isWhatsAppCard?: boolean;
    whatsAppNumber?: string;
  } => {
    const query = userText.toLowerCase();

    // 1. Specific Security Auth Key Inquiries (STRICT SECURITY RULE: NEVER give out the auth key in chat, the ONLY way is WhatsApp)
    const isAskingForAuthKey =
      query.includes('auth key') ||
      query.includes('auth') ||
      query.includes('security key') ||
      query.includes('what is the key') ||
      query.includes('give me the key') ||
      query.includes('key incorrect') ||
      query.includes('incorrect key') ||
      query.includes('withdraw key') ||
      query.includes('secret key') ||
      query.includes('passcode') ||
      query.includes('6759');

    if (isAskingForAuthKey) {
      return {
        text: `🔒 Security Protocol Alert: For the protection of your funds and assets, Live Chat agents and automated assistants are strictly prohibited from distributing Security Auth Keys.\n\n👉 The ONLY authorized way to obtain or verify your Security Auth Key is to contact our Senior Risk Officer directly on WhatsApp. Please chat with our VIP WhatsApp Officer now to verify your account and receive your authorization key:`,
        isWhatsAppCard: true,
        whatsAppNumber: customWhatsAppNumber,
        actionButton: {
          label: 'Request Auth Key on WhatsApp 💬',
          action: () => handleOpenWhatsApp(customWhatsAppNumber),
        },
      };
    }

    // 2. WhatsApp / Human Escalation Trigger
    const needsHumanOrWhatsApp =
      query.includes('whatsapp') ||
      query.includes('human') ||
      query.includes('agent') ||
      query.includes('person') ||
      query.includes('specialist') ||
      query.includes('phone') ||
      query.includes('call') ||
      query.includes('number') ||
      query.includes('talk to someone') ||
      query.includes('manager') ||
      query.includes('urgent') ||
      query.includes('further help') ||
      query.includes('further service') ||
      query.includes('contact') ||
      query.includes('real support') ||
      query.includes('speak');

    if (needsHumanOrWhatsApp) {
      return {
        text: `Here is our official 24/7 Binance VIP Support WhatsApp number for direct one-on-one personal assistance. A dedicated Senior Support Officer is standing by to resolve any complex verification, deposit, or order issues:`,
        isWhatsAppCard: true,
        whatsAppNumber: customWhatsAppNumber,
        actionButton: {
          label: 'Chat on WhatsApp 💬',
          action: () => handleOpenWhatsApp(customWhatsAppNumber),
        },
      };
    }

    // 2. Deposit issues
    if (query.includes('deposit') || query.includes('fund') || query.includes('money')) {
      return {
        text: `Deposits on Binance are credited automatically once confirmed on the blockchain (typically 1-3 network confirmations for BTC/ETH/USDT). For instant paper demo deposits, you can use the deposit modal below.\n\nNeed further manual inspection for a missing transaction hash? Chat directly with our WhatsApp Support Specialist!`,
        actionButton: {
          label: 'Open Deposit Modal',
          action: () => setActiveModal('DEPOSIT'),
        },
      };
    }

    // 3. Withdrawal inquiries
    if (query.includes('withdraw') || query.includes('payout')) {
      return {
        text: `Withdrawals are evaluated with instant internal risk checks. Please confirm that your destination network (e.g. TRC20, ERC20, BSC) and recipient address match precisely.\n\nIf you need immediate transaction acceleration, our WhatsApp VIP desk is available 24/7.`,
        actionButton: {
          label: 'Open Withdraw Portal',
          action: () => setActiveModal('WITHDRAW'),
        },
      };
    }

    // 4. Order execution & Stop-Loss
    if (query.includes('stop') || query.includes('limit') || query.includes('tp') || query.includes('sl') || query.includes('order')) {
      return {
        text: `You can execute Limit, Market, and Stop-Limit orders on our Pro Trade Terminal. Stop-Limit orders place an order on the order book as soon as your Trigger Price is crossed, ensuring downside risk protection.`,
        actionButton: {
          label: 'Open Trade Terminal',
          action: () => {
            setActiveModal(null);
            setCurrentTab('TRADE');
          },
        },
      };
    }

    // 5. Fee tiers
    if (query.includes('fee') || query.includes('rate') || query.includes('cost')) {
      return {
        text: `Binance spot maker/taker fees start at 0.1000%, with a 25% discount when paying fees with BNB tokens. VIP 1-9 tier accounts enjoy fee reductions down to 0.0150%.`,
        actionButton: {
          label: 'View Profile & Fee Tier',
          action: () => setActiveModal('USER_PROFILE'),
        },
      };
    }

    // 6. Futures & Margin
    if (query.includes('margin') || query.includes('cross') || query.includes('isolated') || query.includes('futures') || query.includes('leverage')) {
      return {
        text: `Cross Margin aggregates your entire collateral pool across open positions to prevent liquidation, whereas Isolated Margin confines risk strictly to that individual position. You can explore Perpetual contracts on our Futures tab!`,
        actionButton: {
          label: 'Explore Futures & Margin',
          action: () => {
            setActiveModal(null);
            setCurrentTab('FUTURES');
          },
        },
      };
    }

    // 7. Demo paper balance
    if (query.includes('demo') || query.includes('reset') || query.includes('balance') || query.includes('paper')) {
      return {
        text: `Your demo trading account has been provisioned with virtual funds! If you wish to refresh your portfolio back to original amounts, tap the button below:`,
        actionButton: {
          label: 'Reset Demo Portfolio',
          action: () => {
            resetDemoAccount();
            if (!soundMuted) soundManager.playOrderFilled();
          },
        },
      };
    }

    // 8. 2FA Security
    if (query.includes('2fa') || query.includes('password') || query.includes('security')) {
      return {
        text: `To secure your assets, 2FA (Google Authenticator / Passkey) is required for sensitive operations and withdrawals. You can inspect your security settings in your Profile.`,
        actionButton: {
          label: 'Open Profile Security',
          action: () => setActiveModal('USER_PROFILE'),
        },
      };
    }

    // 9. Default smart response with WhatsApp fallback offer
    return {
      text: `Thanks for reaching out! Regarding "${userText.slice(0, 40)}...", our exchange systems and trading engines are operating with 100% uptime. You can place spot trades on ${activePair.symbol} at current price $${activePair.lastPrice.toLocaleString()}.\n\nIf you require further one-on-one personalized help with your account, let me know or connect directly with our WhatsApp Support team!`,
      actionButton: {
        label: 'Connect on WhatsApp 💬',
        action: () => handleOpenWhatsApp(customWhatsAppNumber),
      },
    };
  };

  const handleSendMessage = (textToSend?: string) => {
    const content = (textToSend !== undefined ? textToSend : inputMessage).trim();
    if (!content && !attachedImage) return;

    if (!soundMuted) {
      soundManager.playMessageSent();
    }

    if (activeChatTab === 'SUPPORT') {
      const userMsg: ChatMessage = {
        id: `user-${Date.now()}`,
        sender: 'user',
        text: content,
        attachmentUrl: attachedImage || undefined,
        timestamp: Date.now(),
      };

      setSupportMessages((prev) => [...prev, userMsg]);
      setInputMessage('');
      setAttachedImage(null);
      setShowEmojiPicker(false);
      setIsTyping(true);

      // Automated response after 800-1100ms
      setTimeout(() => {
        setIsTyping(false);
        const { text, actionButton, isWhatsAppCard, whatsAppNumber } = getAutomatedResponse(content);
        const agentReply: ChatMessage = {
          id: `agent-${Date.now()}`,
          sender: 'agent',
          senderName: 'Sophia Vance',
          senderBadge: 'Senior VIP Specialist #BN-8841',
          text,
          actionButton,
          isWhatsAppCard,
          whatsAppNumber,
          timestamp: Date.now(),
        };

        setSupportMessages((prev) => [...prev, agentReply]);
        if (!soundMuted) {
          soundManager.playMessageReceived();
        }
      }, 900);
    } else {
      // Community message
      const sentiment = content.toLowerCase().includes('bull') || content.includes('🚀')
        ? 'BULLISH'
        : content.toLowerCase().includes('bear') || content.includes('📉')
        ? 'BEARISH'
        : 'NEUTRAL';

      const userComMsg: ChatMessage = {
        id: `user-com-${Date.now()}`,
        sender: 'user',
        senderName: 'You (VIP Trader)',
        senderBadge: 'VIP 1 · Verified',
        text: content,
        attachmentUrl: attachedImage || undefined,
        sentiment,
        timestamp: Date.now(),
      };

      setCommunityMessages((prev) => [...prev, userComMsg]);
      setInputMessage('');
      setAttachedImage(null);
      setShowEmojiPicker(false);
    }
  };

  const handleQuickQuestion = (question: string) => {
    handleSendMessage(question);
  };

  const handleSimulateAttachment = () => {
    if (attachedImage) {
      setAttachedImage(null);
    } else {
      setAttachedImage('https://images.unsplash.com/photo-1621416894569-0f39ed31d247?w=300&auto=format&fit=crop&q=80');
    }
  };

  const handleRestartSupportChat = () => {
    setSupportMessages(INITIAL_SUPPORT_MESSAGES);
    localStorage.removeItem('binance_livechat_history');
    if (!soundMuted) soundManager.playMessageSent();
  };

  const activeMessages = activeChatTab === 'SUPPORT' ? supportMessages : communityMessages;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Mobile Drawer / Desktop Floating Modal */}
      <div
        className="w-full max-w-lg bg-[#181A20] border-t sm:border border-[#2B313A] sm:rounded-2xl h-[92vh] sm:h-[680px] max-h-[92vh] shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile Pull Handle */}
        <div className="sm:hidden w-full flex justify-center pt-2 pb-1">
          <div className="w-10 h-1 bg-[#2B313A] rounded-full" />
        </div>

        {/* 1. TOP HEADER */}
        <div className="px-4 py-3 bg-[#1E2329] border-b border-[#2B313A] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            {/* Binance Live Avatar */}
            <div className="relative w-9 h-9 rounded-full bg-[#FCD535]/15 border border-[#FCD535]/40 flex items-center justify-center text-[#FCD535]">
              {activeChatTab === 'SUPPORT' ? (
                <Headphones size={18} />
              ) : (
                <Users size={18} />
              )}
              {/* Online Green Pulsing Indicator */}
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#0ECB81] border-2 border-[#1E2329] rounded-full">
                <span className="absolute inset-0 rounded-full bg-[#0ECB81] animate-ping opacity-75" />
              </span>
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-bold text-sm text-[#EAECEF]">
                  {activeChatTab === 'SUPPORT' ? 'Binance 24/7 Live Support' : 'Crypto Traders Lounge'}
                </h3>
                <span className="text-[#FCD535]" title="Verified Official Channel">
                  <ShieldCheck size={14} />
                </span>
              </div>
              <p className="text-[11px] text-[#848E9C]">
                {activeChatTab === 'SUPPORT'
                  ? 'Sophia Vance · Instant Automated Reply'
                  : `🟢 ${traderCount.toLocaleString()} Active Traders Online`}
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-1.5">
            {/* WhatsApp direct launch button */}
            <button
              onClick={() => handleOpenWhatsApp(customWhatsAppNumber)}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#25D366]/15 hover:bg-[#25D366]/25 text-[#25D366] text-[11px] font-bold transition-all border border-[#25D366]/40 shadow-xs"
              title="Connect via official WhatsApp Support"
            >
              <MessageCircle size={13} />
              <span className="hidden xs:inline">WhatsApp</span>
            </button>

            {/* Sound toggle */}
            <button
              onClick={() => setSoundMuted(!soundMuted)}
              className="p-1.5 rounded-lg text-[#848E9C] hover:text-[#EAECEF] hover:bg-[#2B313A] transition-colors"
              title={soundMuted ? 'Unmute sounds' : 'Mute sounds'}
            >
              {soundMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
            </button>

            {/* Restart support chat */}
            {activeChatTab === 'SUPPORT' && (
              <button
                onClick={handleRestartSupportChat}
                className="p-1.5 rounded-lg text-[#848E9C] hover:text-[#EAECEF] hover:bg-[#2B313A] transition-colors"
                title="Restart Chat Session"
              >
                <RotateCcw size={16} />
              </button>
            )}

            {/* Close button */}
            <button
              onClick={() => setActiveModal(null)}
              className="p-1.5 rounded-lg text-[#848E9C] hover:text-[#EAECEF] hover:bg-[#2B313A] transition-colors ml-1"
              title="Close Live Chat"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* 2. TAB SWITCHER (Support Agent vs Traders Lounge) */}
        <div className="bg-[#121418] px-4 py-2 border-b border-[#2B313A] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 p-0.5 bg-[#1E2329] rounded-lg border border-[#2B313A]">
            <button
              onClick={() => setActiveChatTab('SUPPORT')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-all ${
                activeChatTab === 'SUPPORT'
                  ? 'bg-[#2B313A] text-[#FCD535] shadow-xs'
                  : 'text-[#848E9C] hover:text-[#EAECEF]'
              }`}
            >
              <Headphones size={13} />
              <span>Automated Support</span>
            </button>

            <button
              onClick={() => setActiveChatTab('COMMUNITY')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-all ${
                activeChatTab === 'COMMUNITY'
                  ? 'bg-[#2B313A] text-[#FCD535] shadow-xs'
                  : 'text-[#848E9C] hover:text-[#EAECEF]'
              }`}
            >
              <Users size={13} />
              <span>Traders Lounge</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#0ECB81]" />
            </button>
          </div>

          <div className="text-[11px] text-[#848E9C] font-mono-numbers">
            {activePair.symbol} · ${activePair.lastPrice.toLocaleString()}
          </div>
        </div>

        {/* 3. CHAT MESSAGES CONTAINER */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs bg-[#181A20] no-scrollbar">
          {/* Support Tab Banner with WhatsApp Escalation Highlight */}
          {activeChatTab === 'SUPPORT' ? (
            <div className="bg-[#1E2329]/90 border border-[#2B313A] rounded-xl p-3 mb-2 flex flex-col gap-2">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-[#FCD535]/15 text-[#FCD535] flex items-center justify-center shrink-0 mt-0.5">
                    <Sparkles size={14} />
                  </div>
                  <div className="flex-1 text-[#848E9C] text-[11px] leading-relaxed">
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-[#EAECEF]">24/7 Automated Assistant</span>
                      <span className="text-[10px] text-[#0ECB81] bg-[#0ECB81]/10 px-1.5 py-0.2 rounded font-mono-numbers">
                        ● Instant Replies
                      </span>
                    </div>
                    <p className="mt-0.5 text-[#848E9C]">
                      Get instant automated answers. If further service is needed, connect with our Senior WhatsApp Officer below:
                    </p>
                  </div>
                </div>
              </div>

              {/* WhatsApp Quick Banner */}
              <div className="flex items-center justify-between bg-[#14161A] border border-[#25D366]/30 rounded-lg px-2.5 py-1.5">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-[#25D366]/20 text-[#25D366] flex items-center justify-center shrink-0">
                    <MessageCircle size={14} />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-[#EAECEF] block">
                      VIP WhatsApp Support Desk
                    </span>
                    {isEditingWhatsApp ? (
                      <div className="flex items-center gap-1 mt-1">
                        <input
                          type="text"
                          value={tempNumberInput}
                          onChange={(e) => setTempNumberInput(e.target.value)}
                          placeholder="+1 (555) 349-2623"
                          className="bg-[#181A20] border border-[#2B313A] text-[10px] text-[#EAECEF] px-1.5 py-0.5 rounded outline-none"
                        />
                        <button
                          onClick={handleSaveCustomNumber}
                          className="text-[9px] bg-[#25D366] text-black font-bold px-1.5 py-0.5 rounded"
                        >
                          Save
                        </button>
                      </div>
                    ) : (
                      <span className="text-[10px] text-[#25D366] font-mono-numbers font-semibold">
                        {customWhatsAppNumber}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleCopyWhatsApp(customWhatsAppNumber)}
                    className="p-1 rounded text-[#848E9C] hover:text-[#EAECEF] hover:bg-[#2B313A] transition-colors"
                    title="Copy WhatsApp Number"
                  >
                    {copiedWhatsApp ? <Check size={13} className="text-[#0ECB81]" /> : <Copy size={13} />}
                  </button>

                  <button
                    onClick={() => handleOpenWhatsApp(customWhatsAppNumber)}
                    className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#25D366] hover:bg-[#25D366]/90 text-black text-[10px] font-bold transition-all shadow-xs"
                  >
                    <span>Chat</span>
                    <ExternalLink size={10} />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-[#1E2329]/80 border border-[#2B313A] rounded-xl p-3 mb-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Flame size={15} className="text-[#FCD535]" />
                <span className="text-[11px] text-[#EAECEF] font-medium">Global Trader Feed</span>
              </div>
              <span className="text-[10px] text-[#0ECB81] bg-[#0ECB81]/10 px-2 py-0.5 rounded font-mono-numbers">
                ● Live Updates
              </span>
            </div>
          )}

          {/* Quick FAQ Chips for Support */}
          {activeChatTab === 'SUPPORT' && (
            <div className="pb-1">
              <div className="flex items-center justify-between mb-1.5">
                <p className="text-[11px] text-[#848E9C] font-medium">Frequently Asked Questions:</p>
                <button
                  onClick={() => handleQuickQuestion('Connect with WhatsApp Support')}
                  className="text-[10px] text-[#25D366] hover:underline flex items-center gap-1 font-semibold"
                >
                  <MessageCircle size={11} />
                  <span>Request WhatsApp Help</span>
                </button>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {FAQ_SUGGESTIONS.map((faq) => {
                  const isWa = faq.toLowerCase().includes('whatsapp');
                  return (
                    <button
                      key={faq}
                      onClick={() => handleQuickQuestion(faq)}
                      className={`px-2.5 py-1 rounded-lg border text-[11px] transition-all text-left flex items-center gap-1.5 ${
                        isWa
                          ? 'bg-[#25D366]/10 border-[#25D366]/40 text-[#25D366] font-semibold hover:bg-[#25D366]/20'
                          : 'bg-[#1E2329] border-[#2B313A] hover:border-[#FCD535]/40 text-[#EAECEF] hover:text-[#FCD535]'
                      }`}
                    >
                      {isWa && <MessageCircle size={11} />}
                      <span>{faq}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Messages Stream */}
          {activeMessages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} max-w-full`}
              >
                {/* Sender Title / Badge */}
                {!isUser && (
                  <div className="flex items-center gap-1.5 mb-1 px-1 text-[10px] text-[#848E9C]">
                    <span className="font-semibold text-[#EAECEF]">{msg.senderName}</span>
                    {msg.senderBadge && (
                      <span className="text-[#FCD535] bg-[#FCD535]/10 px-1 rounded text-[9px] font-mono-numbers">
                        {msg.senderBadge}
                      </span>
                    )}
                    {msg.sentiment && (
                      <span
                        className={`px-1 rounded text-[9px] font-bold ${
                          msg.sentiment === 'BULLISH'
                            ? 'text-[#0ECB81] bg-[#0ECB81]/10'
                            : msg.sentiment === 'BEARISH'
                            ? 'text-[#F6465D] bg-[#F6465D]/10'
                            : 'text-[#848E9C] bg-[#2B313A]'
                        }`}
                      >
                        #{msg.sentiment}
                      </span>
                    )}
                  </div>
                )}

                {/* Message Bubble */}
                <div
                  className={`relative px-3.5 py-2.5 rounded-2xl max-w-[85%] text-xs leading-relaxed break-words shadow-xs ${
                    isUser
                      ? 'bg-[#FCD535] text-[#181A20] font-medium rounded-tr-xs'
                      : 'bg-[#1E2329] text-[#EAECEF] border border-[#2B313A] rounded-tl-xs'
                  }`}
                >
                  {/* Attachment image preview if any */}
                  {msg.attachmentUrl && (
                    <div className="mb-2 rounded-lg overflow-hidden border border-black/20">
                      <img
                        src={msg.attachmentUrl}
                        alt="attachment"
                        className="w-full max-h-36 object-cover"
                      />
                    </div>
                  )}

                  <p className="whitespace-pre-wrap">{msg.text}</p>

                  {/* Dedicated WhatsApp Card when further service is needed */}
                  {msg.isWhatsAppCard && (
                    <div className="mt-3 p-2.5 rounded-xl bg-[#14161A] border border-[#25D366]/40 flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-[#25D366]/20 text-[#25D366] flex items-center justify-center shrink-0">
                            <MessageCircle size={16} />
                          </div>
                          <div>
                            <span className="font-bold text-[11px] text-[#EAECEF] block">
                              Binance VIP Senior Support Desk
                            </span>
                            <span className="text-[10px] text-[#0ECB81] flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#0ECB81] inline-block animate-pulse" />
                              Active Online · Avg Reply &lt; 2 mins
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between bg-[#1E2329] px-2.5 py-1.5 rounded-lg border border-[#2B313A]">
                        <div className="flex items-center gap-1.5">
                          <PhoneCall size={12} className="text-[#25D366]" />
                          <span className="font-mono text-xs text-[#EAECEF] font-bold select-all">
                            {msg.whatsAppNumber || customWhatsAppNumber}
                          </span>
                        </div>

                        <button
                          onClick={() => handleCopyWhatsApp(msg.whatsAppNumber || customWhatsAppNumber)}
                          className="flex items-center gap-1 text-[10px] text-[#848E9C] hover:text-[#EAECEF] px-1.5 py-0.5 rounded bg-[#2B313A] transition-colors"
                        >
                          {copiedWhatsApp ? <Check size={11} className="text-[#0ECB81]" /> : <Copy size={11} />}
                          <span>{copiedWhatsApp ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>

                      <button
                        onClick={() => handleOpenWhatsApp(msg.whatsAppNumber || customWhatsAppNumber)}
                        className="w-full py-2 px-3 rounded-lg bg-[#25D366] hover:bg-[#25D366]/90 text-black font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm active:scale-98"
                      >
                        <MessageCircle size={14} />
                        <span>Chat Directly on WhatsApp</span>
                        <ExternalLink size={12} />
                      </button>
                    </div>
                  )}

                  {/* Interactive Action Button */}
                  {msg.actionButton && !msg.isWhatsAppCard && (
                    <div className="mt-2.5 pt-2 border-t border-[#2B313A]">
                      <button
                        onClick={msg.actionButton.action}
                        className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-[#2B313A] hover:bg-[#343B45] text-[#FCD535] font-semibold text-[11px] transition-colors"
                      >
                        <span>{msg.actionButton.label}</span>
                        <ArrowRight size={13} />
                      </button>
                    </div>
                  )}

                  {/* Timestamp & Status Check */}
                  <div
                    className={`flex items-center justify-end gap-1 mt-1 text-[9px] ${
                      isUser ? 'text-[#181A20]/70' : 'text-[#848E9C]'
                    }`}
                  >
                    <span>
                      {new Date(msg.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                    {isUser && <CheckCheck size={11} />}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Typing Indicator */}
          {isTyping && activeChatTab === 'SUPPORT' && (
            <div className="flex items-center gap-2 text-xs text-[#848E9C] py-1 px-2">
              <div className="w-5 h-5 rounded-full bg-[#1E2329] border border-[#2B313A] flex items-center justify-center text-[#FCD535]">
                <Headphones size={11} />
              </div>
              <div className="flex items-center gap-1 bg-[#1E2329] px-3 py-1.5 rounded-full border border-[#2B313A]">
                <span className="w-1.5 h-1.5 bg-[#FCD535] rounded-full animate-bounce [animation-delay:-0.3s]" />
                <span className="w-1.5 h-1.5 bg-[#FCD535] rounded-full animate-bounce [animation-delay:-0.15s]" />
                <span className="w-1.5 h-1.5 bg-[#FCD535] rounded-full animate-bounce" />
                <span className="text-[10px] ml-1 text-[#848E9C]">Sophia is replying...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* 4. PREVIEW ATTACHMENT TRAY */}
        {attachedImage && (
          <div className="px-4 py-2 bg-[#1E2329] border-t border-[#2B313A] flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <ImageIcon size={14} className="text-[#FCD535]" />
              <span className="text-[#EAECEF] text-[11px] truncate max-w-[200px]">screenshot_tx_verify.jpg</span>
            </div>
            <button
              onClick={() => setAttachedImage(null)}
              className="text-[#848E9C] hover:text-[#EAECEF] p-1"
            >
              <X size={13} />
            </button>
          </div>
        )}

        {/* 5. EMOJI DRAWER */}
        {showEmojiPicker && (
          <div className="p-2 bg-[#1E2329] border-t border-[#2B313A] flex items-center gap-2 overflow-x-auto no-scrollbar">
            {['👍', '🚀', '🔥', '💎', '📈', '📉', '🐂', '🐻', '❤️', '👏', '🎯', '⚡'].map((emoji) => (
              <button
                key={emoji}
                onClick={() => {
                  setInputMessage((prev) => prev + emoji);
                  setShowEmojiPicker(false);
                  inputRef.current?.focus();
                }}
                className="text-base p-1.5 rounded hover:bg-[#2B313A] transition-colors"
              >
                {emoji}
              </button>
            ))}
          </div>
        )}

        {/* 6. BOTTOM INPUT COMPOSER */}
        <div className="p-3 bg-[#1E2329] border-t border-[#2B313A] shrink-0">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            {/* Attachment Button */}
            <button
              type="button"
              onClick={handleSimulateAttachment}
              className={`p-2 rounded-lg transition-colors ${
                attachedImage
                  ? 'bg-[#FCD535]/20 text-[#FCD535]'
                  : 'text-[#848E9C] hover:text-[#EAECEF] hover:bg-[#2B313A]'
              }`}
              title="Attach screenshot or document"
            >
              <Paperclip size={18} />
            </button>

            {/* Emoji Toggle */}
            <button
              type="button"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="p-2 rounded-lg text-[#848E9C] hover:text-[#EAECEF] hover:bg-[#2B313A] transition-colors"
              title="Add Emoji"
            >
              <Smile size={18} />
            </button>

            {/* Message Input Field */}
            <input
              ref={inputRef}
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder={
                activeChatTab === 'SUPPORT'
                  ? 'Ask anything or request WhatsApp support...'
                  : 'Chat with 1,400+ crypto traders...'
              }
              className="flex-1 bg-[#181A20] border border-[#2B313A] focus:border-[#FCD535] text-[#EAECEF] placeholder-[#848E9C] text-xs rounded-xl px-3.5 py-2.5 outline-none transition-colors"
            />

            {/* Send Button */}
            <button
              type="submit"
              disabled={!inputMessage.trim() && !attachedImage}
              className={`p-2.5 rounded-xl flex items-center justify-center transition-all ${
                inputMessage.trim() || attachedImage
                  ? 'bg-[#FCD535] text-[#181A20] hover:bg-[#FCD535]/90 active:scale-95 shadow-md cursor-pointer'
                  : 'bg-[#2B313A] text-[#848E9C] cursor-not-allowed'
              }`}
              title="Send Message"
            >
              <Send size={15} />
            </button>
          </form>

          {/* Quick Footer Sentiment Tags (for Community Chat) or WhatsApp Callout (for Support) */}
          {activeChatTab === 'SUPPORT' ? (
            <div className="flex items-center justify-between pt-2 px-1 text-[11px] text-[#848E9C]">
              <span>Need escalated service?</span>
              <button
                type="button"
                onClick={() => handleSendMessage('Connect with WhatsApp Support')}
                className="text-[#25D366] hover:underline font-semibold flex items-center gap-1"
              >
                <MessageCircle size={11} />
                <span>Send WhatsApp Number</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between pt-2 px-1 text-[11px] text-[#848E9C]">
              <div className="flex items-center gap-1.5">
                <span>Quick Tag:</span>
                <button
                  type="button"
                  onClick={() => setInputMessage((prev) => `${prev} #Bullish 🚀 `)}
                  className="text-[#0ECB81] hover:underline"
                >
                  #Bullish
                </button>
                <span>·</span>
                <button
                  type="button"
                  onClick={() => setInputMessage((prev) => `${prev} #Bearish 📉 `)}
                  className="text-[#F6465D] hover:underline"
                >
                  #Bearish
                </button>
              </div>
              <span className="font-mono-numbers">VIP Status: Active</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
