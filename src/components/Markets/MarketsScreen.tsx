import React, { useState, useMemo } from 'react';
import { useTrading } from '../../context/TradingContext';
import { CryptoIcon } from '../Icons/CryptoIcons';
import { formatPrice, formatVolume } from '../../utils/formatters';
import { Search, Star, ArrowUpDown } from 'lucide-react';

export const MarketsScreen: React.FC = () => {
  const { pairs, setActivePairById, setCurrentTab, toggleFavoritePair } = useTrading();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<'Hot' | 'Gainers' | 'Losers' | '24h Vol' | 'Favorites'>('Hot');

  const filtered = useMemo(() => {
    let list = pairs.filter(
      (p) =>
        p.symbol.toLowerCase().includes(search.toLowerCase()) ||
        p.base.toLowerCase().includes(search.toLowerCase())
    );

    if (category === 'Favorites') {
      list = list.filter((p) => p.isFavorite);
    } else if (category === 'Gainers') {
      list = [...list].sort((a, b) => b.priceChangePercent - a.priceChangePercent);
    } else if (category === 'Losers') {
      list = [...list].sort((a, b) => a.priceChangePercent - b.priceChangePercent);
    } else if (category === '24h Vol') {
      list = [...list].sort((a, b) => b.turnover24h - a.turnover24h);
    }

    return list;
  }, [pairs, search, category]);

  const handleSelectPair = (pairId: string) => {
    setActivePairById(pairId);
    setCurrentTab('TRADE');
  };

  return (
    <div className="flex-1 w-full bg-[#181A20] text-[#EAECEF] overflow-y-auto no-scrollbar pb-20 select-none">
      <div className="w-full max-w-md mx-auto px-4 pt-3 flex flex-col gap-3">
        {/* Title & Search */}
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold tracking-tight text-[#EAECEF]">Markets</h1>
        </div>

        {/* Search Input */}
        <div className="bg-[#1E2329] border border-[#2B313A] rounded-xl px-3 py-2 flex items-center gap-2">
          <Search size={15} className="text-[#848E9C]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search coin or contract..."
            className="w-full bg-transparent text-xs text-[#EAECEF] focus:outline-none"
          />
        </div>

        {/* Categories Bar */}
        <div className="flex items-center gap-4 text-xs border-b border-[#2B313A] pb-2 overflow-x-auto no-scrollbar">
          {(['Hot', 'Gainers', 'Losers', '24h Vol', 'Favorites'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`font-semibold whitespace-nowrap transition-colors ${
                category === cat ? 'text-[#FCD535]' : 'text-[#848E9C] hover:text-[#EAECEF]'
              }`}
            >
              {cat === 'Favorites' ? '★ Favorites' : cat}
            </button>
          ))}
        </div>

        {/* Markets Table */}
        <table className="w-full text-left text-xs font-mono-numbers">
          <thead>
            <tr className="text-[10px] text-[#848E9C] font-sans border-b border-[#2B313A]/50">
              <th className="py-2">Name / Vol</th>
              <th className="py-2 text-right">Last Price</th>
              <th className="py-2 text-right">24h Change</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#2B313A]/30">
            {filtered.map((pair) => {
              const isBull = pair.priceChangePercent >= 0;
              return (
                <tr
                  key={pair.id}
                  onClick={() => handleSelectPair(pair.id)}
                  className="hover:bg-[#1E2329] cursor-pointer transition-colors"
                >
                  <td className="py-3 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavoritePair(pair.id);
                      }}
                      className="text-[#848E9C] hover:text-[#FCD535]"
                    >
                      <Star
                        size={13}
                        className={pair.isFavorite ? 'fill-[#FCD535] text-[#FCD535]' : ''}
                      />
                    </button>
                    <CryptoIcon symbol={pair.base} size={20} />
                    <div className="flex flex-col">
                      <div className="flex items-center gap-1">
                        <span className="font-bold text-[#EAECEF] text-xs">{pair.base}</span>
                        <span className="text-[10px] text-[#848E9C]">/{pair.quote}</span>
                      </div>
                      <span className="text-[10px] text-[#848E9C]">
                        Vol {formatVolume(pair.volume24h)}
                      </span>
                    </div>
                  </td>

                  <td className="py-3 text-right">
                    <div className="font-bold text-xs text-[#EAECEF]">
                      ${formatPrice(pair.lastPrice, pair.precisionPrice)}
                    </div>
                    <div className="text-[10px] text-[#848E9C]">
                      ${formatPrice(pair.lastPrice, 2)}
                    </div>
                  </td>

                  <td className="py-3 text-right">
                    <span
                      className={`inline-block px-2 py-1 rounded text-xs font-bold ${
                        isBull ? 'bg-[#0ECB81] text-white' : 'bg-[#F6465D] text-white'
                      }`}
                    >
                      {isBull ? '+' : ''}
                      {pair.priceChangePercent.toFixed(2)}%
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
