import React, { useState, useMemo } from 'react';
import { useTrading } from '../../context/TradingContext';
import { CryptoIcon } from '../Icons/CryptoIcons';
import { formatPrice, formatVolume } from '../../utils/formatters';
import { Search, Star, X } from 'lucide-react';

export const MarketsDrawer: React.FC = () => {
  const {
    pairs,
    activePair,
    setActivePairById,
    toggleFavoritePair,
    activeModal,
    setActiveModal,
  } = useTrading();

  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState<'All' | 'Favorites' | 'Hot' | 'Layer 1' | 'Meme'>('All');

  const filteredPairs = useMemo(() => {
    return pairs.filter((p) => {
      const matchSearch =
        p.symbol.toLowerCase().includes(search.toLowerCase()) ||
        p.base.toLowerCase().includes(search.toLowerCase());
      if (!matchSearch) return false;

      if (filterCategory === 'Favorites') return !!p.isFavorite;
      if (filterCategory === 'Hot') return p.category === 'Hot';
      if (filterCategory === 'Layer 1') return p.category === 'Layer 1';
      if (filterCategory === 'Meme') return p.category === 'Meme';
      return true;
    });
  }, [pairs, search, filterCategory]);

  if (activeModal !== 'MARKETS') return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
      <div className="bg-[#1E2329] border border-[#2B313A] rounded-lg w-full max-w-xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden select-none">
        {/* Header */}
        <div className="px-4 py-3 border-b border-[#2B313A] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm text-[#EAECEF]">Select Market Pair</span>
            <span className="text-[11px] text-[#848E9C]">({filteredPairs.length} pairs available)</span>
          </div>
          <button
            onClick={() => setActiveModal(null)}
            className="text-[#848E9C] hover:text-[#EAECEF] p-1 rounded hover:bg-[#2B313A] transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-3 border-b border-[#2B313A]/60 flex items-center gap-2">
          <div className="flex-1 flex items-center gap-2 bg-[#2B313A] px-3 py-1.5 rounded border border-transparent focus-within:border-[#848E9C]">
            <Search size={14} className="text-[#848E9C]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search coin or pair (e.g. BTC, ETH, SOL)..."
              className="bg-transparent text-xs text-[#EAECEF] focus:outline-none w-full"
              autoFocus
            />
            {search && (
              <button onClick={() => setSearch('')} className="text-[#848E9C] hover:text-[#EAECEF]">
                <X size={12} />
              </button>
            )}
          </div>
        </div>

        {/* Filter Categories */}
        <div className="px-3 py-2 border-b border-[#2B313A]/60 flex items-center gap-2 overflow-x-auto no-scrollbar text-xs">
          {(['All', 'Favorites', 'Hot', 'Layer 1', 'Meme'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${
                filterCategory === cat
                  ? 'bg-[#FCD535] text-[#0E0E0E] font-bold'
                  : 'text-[#848E9C] hover:text-[#EAECEF] hover:bg-[#2B313A]'
              }`}
            >
              {cat === 'Favorites' ? '★ Favorites' : cat}
            </button>
          ))}
        </div>

        {/* Pairs List Table */}
        <div className="flex-1 overflow-y-auto no-scrollbar">
          <table className="w-full text-left text-xs font-mono-numbers">
            <thead className="sticky top-0 bg-[#1E2329] border-b border-[#2B313A] text-[10px] text-[#848E9C] font-sans">
              <tr>
                <th className="py-2 px-4">Pair</th>
                <th className="py-2 px-2 text-right">Last Price</th>
                <th className="py-2 px-2 text-right">24h Change</th>
                <th className="py-2 px-4 text-right">24h Volume</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2B313A]/30">
              {filteredPairs.map((pair) => {
                const isActive = pair.id === activePair.id;
                const isBull = pair.priceChangePercent >= 0;
                return (
                  <tr
                    key={pair.id}
                    onClick={() => {
                      setActivePairById(pair.id);
                      setActiveModal(null);
                    }}
                    className={`cursor-pointer hover:bg-[#2B313A] transition-colors ${
                      isActive ? 'bg-[#2B313A]/70' : ''
                    }`}
                  >
                    <td className="py-2.5 px-4 flex items-center gap-2">
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
                      <CryptoIcon symbol={pair.base} size={18} />
                      <div className="flex items-center gap-1">
                        <span className="font-bold text-[#EAECEF]">{pair.symbol}</span>
                        <span className="text-[10px] text-[#848E9C] bg-[#181A20] px-1 py-0.2 rounded font-sans">
                          10x
                        </span>
                      </div>
                    </td>
                    <td className="py-2.5 px-2 text-right font-medium text-[#EAECEF]">
                      {formatPrice(pair.lastPrice, pair.precisionPrice)}
                    </td>
                    <td
                      className={`py-2.5 px-2 text-right font-medium ${
                        isBull ? 'text-[#0ECB81]' : 'text-[#F6465D]'
                      }`}
                    >
                      {isBull ? '+' : ''}
                      {pair.priceChangePercent.toFixed(2)}%
                    </td>
                    <td className="py-2.5 px-4 text-right text-[#848E9C]">
                      {formatVolume(pair.turnover24h)} USDT
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
