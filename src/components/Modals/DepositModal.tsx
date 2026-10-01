import React, { useState } from 'react';
import { useTrading } from '../../context/TradingContext';
import { CryptoIcon } from '../Icons/CryptoIcons';
import { X, Copy, Check, ArrowRight, ShieldCheck } from 'lucide-react';

export const DepositModal: React.FC = () => {
  const { activeModal, setActiveModal, depositDemoFunds } = useTrading();

  const [selectedCoin, setSelectedCoin] = useState('USDT');
  const [selectedNetwork, setSelectedNetwork] = useState('TRC20');
  const [copied, setCopied] = useState(false);
  const [depositAmount, setDepositAmount] = useState('5000');
  const [depositSuccess, setDepositSuccess] = useState(false);

  if (activeModal !== 'DEPOSIT') return null;

  const mockAddresses: Record<string, string> = {
    TRC20: 'TQn9Y2khEsLJW1ChVWFMSMeSTow5KaxUSDT',
    ERC20: '0x71C8366420A0235a45f147802383771872583802',
    BEP20: '0x8894E0a0c962CB723c1976a4421c95949bE2D4E3',
    SOL: '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU',
  };

  const currentAddress = mockAddresses[selectedNetwork] || mockAddresses.TRC20;

  const handleCopy = () => {
    navigator.clipboard.writeText(currentAddress).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDepositCredit = () => {
    const amt = parseFloat(depositAmount);
    if (!isNaN(amt) && amt > 0) {
      depositDemoFunds(selectedCoin, amt);
      setDepositSuccess(true);
      setTimeout(() => {
        setDepositSuccess(false);
        setActiveModal(null);
      }, 1200);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
      <div className="bg-[#1E2329] border border-[#2B313A] rounded-lg w-full max-w-lg shadow-2xl overflow-hidden select-none">
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-[#2B313A] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm text-[#EAECEF]">Deposit Crypto</span>
            <span className="text-[10px] text-[#0ECB81] bg-[#0ECB81]/15 px-1.5 py-0.5 rounded font-medium flex items-center gap-1">
              <ShieldCheck size={11} /> Instant Sandbox
            </span>
          </div>
          <button
            onClick={() => setActiveModal(null)}
            className="text-[#848E9C] hover:text-[#EAECEF] p-1 rounded hover:bg-[#2B313A] transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col gap-4 text-xs">
          {/* Select Coin */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[#848E9C] text-[11px] font-medium">Select Coin</label>
            <div className="grid grid-cols-5 gap-2">
              {['USDT', 'BTC', 'ETH', 'BNB', 'SOL'].map((coin) => (
                <button
                  key={coin}
                  onClick={() => setSelectedCoin(coin)}
                  className={`flex flex-col items-center gap-1 p-2 rounded border transition-colors ${
                    selectedCoin === coin
                      ? 'border-[#FCD535] bg-[#FCD535]/10 text-[#FCD535]'
                      : 'border-[#2B313A] bg-[#2B313A]/50 text-[#848E9C] hover:text-[#EAECEF]'
                  }`}
                >
                  <CryptoIcon symbol={coin} size={20} />
                  <span className="font-bold text-[11px]">{coin}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Select Network */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[#848E9C] text-[11px] font-medium">Deposit Network</label>
            <div className="grid grid-cols-4 gap-2">
              {['TRC20', 'ERC20', 'BEP20', 'SOL'].map((net) => (
                <button
                  key={net}
                  onClick={() => setSelectedNetwork(net)}
                  className={`p-2 rounded border text-center font-medium transition-colors ${
                    selectedNetwork === net
                      ? 'border-[#FCD535] bg-[#FCD535]/10 text-[#FCD535]'
                      : 'border-[#2B313A] bg-[#2B313A]/50 text-[#848E9C] hover:text-[#EAECEF]'
                  }`}
                >
                  {net}
                </button>
              ))}
            </div>
          </div>

          {/* Address Box */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[#848E9C] text-[11px] font-medium">Deposit Address</label>
            <div className="flex items-center justify-between bg-[#181A20] border border-[#2B313A] rounded px-3 py-2 font-mono-numbers text-[11px] text-[#EAECEF]">
              <span className="truncate mr-2">{currentAddress}</span>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 text-[#FCD535] hover:text-[#F0B90B] font-sans font-medium shrink-0"
              >
                {copied ? <Check size={13} /> : <Copy size={13} />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>

          {/* Quick Credit Sandbox Tool */}
          <div className="bg-[#2B313A]/50 border border-[#2B313A] rounded-lg p-3 flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#EAECEF] text-[11px]">Instant Sandbox Faucet</span>
              <span className="text-[10px] text-[#848E9C]">Test live trading immediately</span>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="number"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                className="flex-1 bg-[#181A20] border border-[#2B313A] rounded px-3 py-1.5 font-mono-numbers text-xs text-[#EAECEF] focus:outline-none focus:border-[#FCD535]"
                placeholder="Amount"
              />
              <span className="font-bold text-[#EAECEF]">{selectedCoin}</span>
              <button
                onClick={handleDepositCredit}
                className="px-4 py-1.5 rounded bg-[#FCD535] hover:bg-[#F0B90B] text-[#0E0E0E] font-bold text-xs tracking-tight transition-all active:scale-[0.98]"
              >
                {depositSuccess ? 'Deposited!' : 'Credit Demo Funds'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
