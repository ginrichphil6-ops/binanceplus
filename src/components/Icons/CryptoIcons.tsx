import React from 'react';

export const BinanceLogo: React.FC<{ className?: string; size?: number }> = ({ className = '', size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path
      d="M16 4.667L22.667 11.333L25.333 8.667L16 0L6.667 8.667L9.333 11.333L16 4.667Z"
      fill="#FCD535"
    />
    <path
      d="M4.667 16L7.333 13.333L4.667 10.667L0 16L4.667 21.333L7.333 18.667L4.667 16Z"
      fill="#FCD535"
    />
    <path
      d="M16 27.333L9.333 20.667L6.667 23.333L16 32L25.333 23.333L22.667 20.667L16 27.333Z"
      fill="#FCD535"
    />
    <path
      d="M27.333 16L24.667 18.667L27.333 21.333L32 16L27.333 10.667L24.667 13.333L27.333 16Z"
      fill="#FCD535"
    />
    <path
      d="M16 11.733L20.267 16L16 20.267L11.733 16L16 11.733Z"
      fill="#FCD535"
    />
  </svg>
);

export const CryptoIcon: React.FC<{ symbol: string; size?: number; className?: string }> = ({
  symbol,
  size = 20,
  className = '',
}) => {
  const sym = symbol.toUpperCase();

  switch (sym) {
    case 'BTC':
      return (
        <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className}>
          <circle cx="16" cy="16" r="16" fill="#F7931A" />
          <path
            d="M23.189 14.02c.314-2.096-1.283-3.223-3.465-3.975l.708-2.84-1.728-.43-.69 2.765c-.454-.113-.92-.22-1.383-.326l.695-2.783-1.728-.431-.708 2.839c-.376-.086-.745-.17-1.103-.258l.002-.007-2.385-.595-.46 1.847s1.283.294 1.256.312c.7.175.827.639.806 1.007l-.807 3.238c.048.012.11.03.179.057l-.182-.045-1.13 4.532c-.086.213-.304.533-.796.411.018.025-1.257-.314-1.257-.314l-.859 1.982 2.25.561c.419.105.83.214 1.236.319l-.715 2.871 1.727.431.708-2.84c.472.128.93.246 1.378.358l-.705 2.827 1.729.431.714-2.866c2.948.558 5.165.333 6.098-2.333.752-2.146-.037-3.385-1.588-4.192 1.13-.26 1.98-1.003 2.208-2.538zm-3.947 5.545c-.534 2.148-4.148.987-5.318.696l.949-3.804c1.17.292 4.928.87 4.369 3.108zm.536-5.58c-.488 1.954-3.498.961-4.474.718l.86-3.45c.976.242 4.124.694 3.614 2.732z"
            fill="white"
          />
        </svg>
      );
    case 'ETH':
      return (
        <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className}>
          <circle cx="16" cy="16" r="16" fill="#627EEA" />
          <path d="M16.498 4v8.87l7.497 3.35L16.498 4z" fill="white" fillOpacity="0.6" />
          <path d="M16.498 4L9 16.22l7.498-3.35V4z" fill="white" />
          <path d="M16.498 21.968v6.027L24 17.616l-7.502 4.352z" fill="white" fillOpacity="0.6" />
          <path d="M16.498 27.995v-6.027L9 17.616l7.498 10.379z" fill="white" />
          <path d="M16.498 20.573l7.497-4.353-7.497-3.348v7.701z" fill="white" fillOpacity="0.2" />
          <path d="M9 16.22l7.498 4.353v-7.701L9 16.22z" fill="white" fillOpacity="0.6" />
        </svg>
      );
    case 'BNB':
      return (
        <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className}>
          <circle cx="16" cy="16" r="16" fill="#F0B90B" />
          <path
            d="M16 8l3.6 3.6-1.7 1.7L16 11.4l-1.9 1.9-1.7-1.7L16 8zm-8 8l1.7-1.7 1.7 1.7-1.7 1.7L8 16zm8 8l-3.6-3.6 1.7-1.7 1.9 1.9 1.9-1.9 1.7 1.7L16 24zm8-8l-1.7 1.7-1.7-1.7 1.7-1.7L24 16zm-8-3.4l3.4 3.4-3.4 3.4-3.4-3.4 3.4-3.4z"
            fill="white"
          />
        </svg>
      );
    case 'SOL':
      return (
        <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className}>
          <circle cx="16" cy="16" r="16" fill="#141414" />
          <path
            d="M8.2 21.6c.2-.2.5-.3.8-.3h12.8c.5 0 .8.6.5.9l-2.2 2.2c-.2.2-.5.3-.8.3H6.5c-.5 0-.8-.6-.5-.9l2.2-2.2zm0-11.2c.2-.2.5-.3.8-.3h12.8c.5 0 .8.6.5.9l-2.2 2.2c-.2.2-.5.3-.8.3H6.5c-.5 0-.8-.6-.5-.9l2.2-2.2zm13.6 5.6c-.2-.2-.5-.3-.8-.3H8.2c-.5 0-.8.6-.5.9l2.2 2.2c.2.2.5.3.8.3h12.8c.5 0 .8-.6.5-.9l-2.2-2.2z"
            fill="url(#solGradient)"
          />
          <defs>
            <linearGradient id="solGradient" x1="6" y1="10" x2="25" y2="25" gradientUnits="userSpaceOnUse">
              <stop stopColor="#00FFA3" />
              <stop offset="1" stopColor="#DC1FFF" />
            </linearGradient>
          </defs>
        </svg>
      );
    case 'DOGE':
      return (
        <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className}>
          <circle cx="16" cy="16" r="16" fill="#C2A633" />
          <path
            d="M13 9h5c3.86 0 7 3.14 7 7s-3.14 7-7 7h-5V9zm3 11.5h2c2.48 0 4.5-2.02 4.5-4.5S20.48 11.5 18 11.5h-2v9zM10.5 15h5v2h-5v-2z"
            fill="white"
          />
        </svg>
      );
    case 'XRP':
      return (
        <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className}>
          <circle cx="16" cy="16" r="16" fill="#23292F" />
          <path
            d="M23.2 8h2.6l-6.3 6.2c-1.9 1.9-5 1.9-6.9 0L6.3 8h2.6l4.9 4.8c1.2 1.2 3.2 1.2 4.4 0L23.2 8zm-14.4 16H6.2l6.3-6.2c1.9-1.9 5-1.9 6.9 0l6.3 6.2h-2.6l-4.9-4.8c-1.2-1.2-3.2-1.2-4.4 0L8.8 24z"
            fill="white"
          />
        </svg>
      );
    case 'USDT':
      return (
        <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className}>
          <circle cx="16" cy="16" r="16" fill="#26A17B" />
          <path
            d="M17.8 15.6v-2.3h4.6V10H9.6v3.3h4.6v2.3c-4.2.2-7.4 1.1-7.4 2.2 0 1.2 3.4 2.1 7.8 2.2v4.5h2.8v-4.5c4.4-.1 7.8-1 7.8-2.2 0-1.1-3.2-2-7.4-2.2zm0 3.7c-2.8.1-6.1-.2-6.1-1.3 0-1 3.1-1.3 6.1-1.3s6.1.3 6.1 1.3c0 1.1-3.3 1.4-6.1 1.3z"
            fill="white"
          />
        </svg>
      );
    default:
      return (
        <div
          style={{ width: size, height: size }}
          className={`rounded-full bg-[#2B313A] flex items-center justify-center text-[10px] font-bold text-[#EAECEF] ${className}`}
        >
          {sym.slice(0, 3)}
        </div>
      );
  }
};
