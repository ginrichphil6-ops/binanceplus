import React, { useState } from 'react';
import { useTrading } from '../../context/TradingContext';
import { X, Shield, Key, Users, CheckCircle, ExternalLink, RefreshCw, Copy, Check, LogOut, UserCheck } from 'lucide-react';
import { formatPrice } from '../../utils/formatters';

export const UserProfileModal: React.FC = () => {
  const { activeModal, setActiveModal, assets, resetDemoAccount, currentUser, logout } = useTrading();
  const [copiedId, setCopiedId] = useState(false);

  if (activeModal !== 'USER_PROFILE') return null;

  const totalUsdBalance = assets.reduce((sum, a) => sum + a.usdValue, 0);

  const handleCopyId = () => {
    navigator.clipboard.writeText('89342019').catch(() => {});
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
      <div className="bg-[#1E2329] border border-[#2B313A] rounded-2xl w-full max-w-md shadow-2xl overflow-hidden select-none">
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#2B313A] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#FCD535]/20 text-[#FCD535] border border-[#FCD535]/40 flex items-center justify-center font-bold text-sm">
              DP
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-sm text-[#EAECEF]">Dianne Pizallo</span>
              <span className="text-[11px] text-[#848E9C]">Username: <strong className="text-[#FCD535] font-mono">DiannePizallo88</strong></span>
            </div>
          </div>
          <button
            onClick={() => setActiveModal(null)}
            className="text-[#848E9C] hover:text-[#EAECEF] p-1.5 rounded-lg hover:bg-[#2B313A] transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Profile Card */}
        <div className="p-5 flex flex-col gap-4 text-xs">
          {/* Identity & User ID */}
          <div className="bg-[#181A20] p-4 rounded-xl border border-[#2B313A] flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11px] text-[#848E9C]">Account Name &amp; User</span>
                <div className="text-base font-bold text-[#EAECEF]">
                  Dianne Pizallo <span className="text-xs text-[#848E9C] font-mono">(@DiannePizallo88)</span>
                </div>
              </div>
              <span className="flex items-center gap-1 text-[11px] text-[#0ECB81] bg-[#0ECB81]/15 px-2 py-0.5 rounded-full font-medium">
                <CheckCircle size={12} /> Verified
              </span>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-[#2B313A]/60">
              <div className="flex flex-col">
                <span className="text-[11px] text-[#848E9C]">Account User ID</span>
                <div className="font-mono-numbers text-sm font-semibold text-[#EAECEF] flex items-center gap-1.5">
                  <span>89342019</span>
                  <button
                    onClick={handleCopyId}
                    className="text-[#848E9C] hover:text-[#FCD535] transition-colors"
                    title="Copy User ID"
                  >
                    {copiedId ? <Check size={12} className="text-[#0ECB81]" /> : <Copy size={12} />}
                  </button>
                </div>
              </div>

              <div className="flex flex-col text-right">
                <span className="text-[11px] text-[#848E9C]">VIP Level</span>
                <span className="text-[#FCD535] font-bold text-sm">VIP 0</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#2B313A]/60 text-[11px]">
              <div>
                <span className="text-[#848E9C]">Email:</span>
                <span className="ml-1 text-[#EAECEF] font-mono">diannepizallo88@gmail.com</span>
              </div>
              <div>
                <span className="text-[#848E9C]">Trading Fee:</span>
                <span className="ml-1 text-[#EAECEF] font-mono-numbers">0.0750%</span>
              </div>
            </div>
          </div>

          {/* Wallet Net Worth */}
          <div className="bg-[#2B313A]/40 p-3.5 rounded-xl border border-[#2B313A] flex items-center justify-between">
            <div>
              <span className="text-[11px] text-[#848E9C]">Estimated Total Balance</span>
              <div className="text-base font-bold font-mono-numbers text-[#EAECEF]">
                $105,568.34
              </div>
            </div>
            <button
              onClick={() => {
                setActiveModal('DEPOSIT');
              }}
              className="px-3.5 py-1.5 rounded-lg bg-[#FCD535] hover:bg-[#F0B90B] text-[#0E0E0E] font-bold text-xs transition-colors"
            >
              Deposit
            </button>
          </div>

          {/* Quick Actions List */}
          <div className="flex flex-col divide-y divide-[#2B313A] border border-[#2B313A] rounded-xl overflow-hidden bg-[#181A20]">
            <div className="p-3 flex items-center justify-between hover:bg-[#2B313A]/50 cursor-pointer transition-colors">
              <div className="flex items-center gap-2.5">
                <Shield size={15} className="text-[#848E9C]" />
                <span className="text-[#EAECEF]">Security (2FA Authenticator)</span>
              </div>
              <span className="text-[10px] text-[#0ECB81] bg-[#0ECB81]/10 px-1.5 py-0.5 rounded">Enabled</span>
            </div>

            <div className="p-3 flex items-center justify-between hover:bg-[#2B313A]/50 cursor-pointer transition-colors">
              <div className="flex items-center gap-2.5">
                <Key size={15} className="text-[#848E9C]" />
                <span className="text-[#EAECEF]">API Management</span>
              </div>
              <ExternalLink size={13} className="text-[#848E9C]" />
            </div>

            <div className="p-3 flex items-center justify-between hover:bg-[#2B313A]/50 cursor-pointer transition-colors">
              <div className="flex items-center gap-2.5">
                <Users size={15} className="text-[#848E9C]" />
                <span className="text-[#EAECEF]">Standard Referral Program</span>
              </div>
              <span className="text-[10px] text-[#FCD535]">20% Commission</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-2.5 pt-1">
            <button
              onClick={() => {
                resetDemoAccount();
                setActiveModal(null);
              }}
              className="w-full py-2.5 rounded-xl bg-[#2B313A] hover:bg-[#38404B] text-[#EAECEF] font-medium flex items-center justify-center gap-2 transition-colors"
            >
              <RefreshCw size={13} />
              <span>Reset Demo Portfolio to Initial State</span>
            </button>

            {/* Logged in User Session Tab */}
            <div className="bg-[#181A20] border border-[#FCD535]/30 rounded-xl px-3.5 py-2.5 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 min-w-0">
                <span className="w-2 h-2 rounded-full bg-[#0ECB81] animate-pulse shrink-0" />
                <span className="text-[#848E9C]">Logged in:</span>
                <span className="font-bold text-[#EAECEF] truncate font-mono">DiannePizallo88</span>
                <span className="text-[10px] bg-[#FCD535]/15 text-[#FCD535] px-1.5 py-0.2 rounded font-medium">VIP 0</span>
              </div>
              <button
                onClick={logout}
                className="text-[#F6465D] hover:underline text-[11px] font-medium flex items-center gap-1 shrink-0"
                title="Log out and return to Black & Yellow Login Page"
              >
                <LogOut size={12} />
                <span>Log Out</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

