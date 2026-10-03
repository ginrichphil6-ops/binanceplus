import React, { useState } from 'react';
import { useTrading } from '../../context/TradingContext';
import { BinanceLogo } from '../Icons/CryptoIcons';
import {
  User,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Globe,
  Radio,
  Fingerprint,
  RefreshCw,
  ExternalLink
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login } = useTrading();

  // Form State - both user name and password boxes are completely blank
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!username.trim()) {
      setErrorMessage('Please enter your email, phone, or username.');
      return;
    }
    if (!password) {
      setErrorMessage('Please enter your account password.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    // Realistic authentication delay before taking straight to home screen
    setTimeout(() => {
      const result = login(username, password);
      setIsLoading(false);
      if (!result.success) {
        setErrorMessage('Incorrect username or password. Please verify and try again.');
      }
    }, 450);
  };

  const handleGoogleClick = () => {
    window.open('https://www.google.com/search?q=binance', '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="min-h-screen w-screen bg-[#0E1015] text-[#EAECEF] flex flex-col justify-between overflow-x-hidden select-none font-sans relative">
      {/* Background Decorative Gold Radiant Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[340px] bg-gradient-to-b from-[#FCD535]/8 via-[#FCD535]/2 to-transparent blur-3xl pointer-events-none" />

      {/* Top Navbar */}
      <header className="h-16 px-4 md:px-8 border-b border-[#2B313A] bg-[#181A20]/90 backdrop-blur-md flex items-center justify-between z-20 shrink-0">
        {/* Brand Header */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <BinanceLogo size={28} />
            <span className="font-extrabold text-lg md:text-xl tracking-tight text-[#EAECEF] uppercase">
              BINANCE
            </span>
          </div>
        </div>

        {/* Right Tools */}
        <div className="flex items-center gap-3 md:gap-5 text-xs">
          <div className="hidden sm:flex items-center gap-1.5 text-[#848E9C]">
            <Radio size={12} className="text-[#0ECB81] animate-pulse" />
            <span className="font-mono text-[11px] text-[#0ECB81]">14ms</span>
            <span className="text-[10px] text-[#5E6673]">· Operational</span>
          </div>

          <div className="flex items-center gap-1 text-[#848E9C] hover:text-[#EAECEF] cursor-pointer transition-colors px-2 py-1 rounded hover:bg-[#2B313A]">
            <Globe size={14} />
            <span className="font-medium">English / USD</span>
          </div>
        </div>
      </header>

      {/* Main Login Viewport */}
      <main className="flex-1 flex items-center justify-center p-4 md:py-10 z-10">
        <div className="w-full max-w-[440px] flex flex-col gap-4">
          
          {/* Primary Login Card */}
          <div className="bg-[#181A20] border border-[#2B313A] rounded-2xl p-6 md:p-8 shadow-2xl relative">
            
            {/* Form Title & Subtitle */}
            <div className="mb-6">
              <h1 className="text-xl md:text-2xl font-bold text-[#EAECEF] tracking-tight">
                Log In
              </h1>
              <p className="text-xs text-[#848E9C] mt-1">
                Enter your username and password to continue to Binance
              </p>
            </div>

            {/* Error Notification Alert */}
            {errorMessage && (
              <div className="mb-5 p-3 rounded-lg bg-[#F6465D]/15 border border-[#F6465D]/40 text-[#F6465D] text-xs flex items-start gap-2.5 animate-fadeIn">
                <AlertCircle size={16} className="shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-medium leading-relaxed">{errorMessage}</p>
                </div>
              </div>
            )}

            {/* Login Form: Username and Password */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {/* Username Field */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-[#848E9C]">
                  Email / Username / Phone
                </label>
                <div className="relative flex items-center">
                  <div className="absolute left-3.5 text-[#848E9C]">
                    <User size={16} />
                  </div>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => {
                      setUsername(e.target.value);
                      if (errorMessage) setErrorMessage(null);
                    }}
                    placeholder="Email / Username / Phone"
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-[#1E2329] border border-[#2B313A] focus:border-[#FCD535] focus:ring-1 focus:ring-[#FCD535] text-sm text-[#EAECEF] placeholder-[#5E6673] outline-none transition-colors"
                    autoFocus
                  />
                  {username && (
                    <button
                      type="button"
                      onClick={() => setUsername('')}
                      className="absolute right-3 text-[11px] text-[#848E9C] hover:text-[#EAECEF]"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>

              {/* Password Field */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-xs">
                  <label className="font-medium text-[#848E9C]">Password</label>
                  <a
                    href="mailto:Binancecareplus@gmail.com?subject=Binance%20Password%20Reset%20Request&body=Hello%20Support%2C%0A%0AI%20am%20requesting%20assistance%20with%20my%20Binance%20account%20password."
                    className="text-[#848E9C] hover:text-[#FCD535] cursor-pointer text-[11px]"
                  >
                    Forgot password?
                  </a>
                </div>

                <div className="relative flex items-center">
                  <div className="absolute left-3.5 text-[#848E9C]">
                    <Lock size={16} />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errorMessage) setErrorMessage(null);
                    }}
                    placeholder="Enter password"
                    className="w-full pl-10 pr-10 py-2.5 rounded-lg bg-[#1E2329] border border-[#2B313A] focus:border-[#FCD535] focus:ring-1 focus:ring-[#FCD535] text-sm text-[#EAECEF] placeholder-[#5E6673] outline-none transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 text-[#848E9C] hover:text-[#EAECEF] transition-colors p-1"
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Remember Me Checkbox */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-[#848E9C] hover:text-[#EAECEF]">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded bg-[#1E2329] border-[#2B313A] text-[#FCD535] accent-[#FCD535] focus:ring-0 focus:ring-offset-0 cursor-pointer"
                  />
                  <span>Remember me on this browser</span>
                </label>
              </div>

              {/* Primary Yellow Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 py-3 rounded-lg bg-[#FCD535] hover:bg-[#F0B90B] active:scale-[0.99] text-[#0E0E0E] font-bold text-sm tracking-wide transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <RefreshCw size={16} className="animate-spin text-[#0E0E0E]" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>Log In</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>

            {/* Alternative Divider */}
            <div className="relative my-6 text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#2B313A]" />
              </div>
              <span className="relative bg-[#181A20] px-3 text-[11px] text-[#848E9C]">
                or continue with
              </span>
            </div>

            {/* Passkey (Disabled) & Google (Navigates to Google Search) */}
            <div className="grid grid-cols-2 gap-2.5">
              {/* Passkey - Explicitly Disabled */}
              <button
                type="button"
                disabled
                className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg bg-[#1E2329]/50 border border-[#2B313A]/50 text-xs text-[#5E6673] font-medium cursor-not-allowed opacity-50 select-none"
                title="Passkey login is currently disabled"
              >
                <Fingerprint size={15} className="text-[#5E6673]" />
                <span>Passkey (Disabled)</span>
              </button>

              {/* Google - Navigates to Google Search */}
              <a
                href="https://www.google.com/search?q=binance"
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleGoogleClick}
                className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg bg-[#1E2329] hover:bg-[#2B313A] border border-[#2B313A] text-xs text-[#EAECEF] font-medium transition-colors cursor-pointer group"
                title="Search on Google"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                  />
                </svg>
                <span>Google</span>
                <ExternalLink size={11} className="text-[#848E9C] group-hover:text-[#EAECEF]" />
              </a>
            </div>

            {/* Bottom Security Assurance Tag */}
            <div className="mt-6 pt-4 border-t border-[#2B313A] flex items-center justify-between text-[11px] text-[#848E9C]">
              <div className="flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-[#0ECB81]" />
                <span>Binance 256-bit SSL Protected</span>
              </div>
              <span className="font-mono text-[#848E9C]">Official Auth</span>
            </div>
          </div>

          {/* Google Sign Up Link */}
          <div className="text-center text-xs text-[#848E9C]">
            <span>Don&apos;t have an account yet? </span>
            <a
              href="https://www.google.com/search?q=binance+sign+up"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#FCD535] hover:underline font-bold inline-flex items-center gap-1"
            >
              <span>Sign up with Google</span>
              <ExternalLink size={11} />
            </a>
          </div>
        </div>
      </main>

      {/* Footer Bar */}
      <footer className="py-4 px-6 border-t border-[#2B313A] bg-[#121418] text-center text-xs text-[#848E9C] flex flex-col sm:flex-row items-center justify-between gap-2 shrink-0 z-10">
        <div>
          <span>&copy; 2017 - 2026 Binance.com. All rights reserved.</span>
        </div>
        <div className="flex items-center gap-4 text-[11px]">
          <span className="hover:text-[#EAECEF] cursor-pointer">Terms of Service</span>
          <span>&middot;</span>
          <span className="hover:text-[#EAECEF] cursor-pointer">Privacy Notice</span>
          <span>&middot;</span>
          <span className="hover:text-[#EAECEF] cursor-pointer">Security Center</span>
        </div>
      </footer>
    </div>
  );
};
