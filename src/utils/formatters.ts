export function formatPrice(price: number, decimals: number = 2): string {
  if (isNaN(price) || price === null || price === undefined) return '0.00';
  if (price < 0.0001) {
    return price.toFixed(8);
  }
  if (price < 1) {
    return price.toFixed(4);
  }
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(price);
}

export function formatAmount(amount: number, decimals: number = 4): string {
  if (isNaN(amount) || amount === null || amount === undefined) return '0.0000';
  if (amount < 0.0001) {
    return amount.toFixed(6);
  }
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(amount);
}

export function formatVolume(volume: number): string {
  if (volume >= 1_000_000_000) {
    return (volume / 1_000_000_000).toFixed(2) + 'B';
  }
  if (volume >= 1_000_000) {
    return (volume / 1_000_000).toFixed(2) + 'M';
  }
  if (volume >= 1_000) {
    return (volume / 1_000).toFixed(2) + 'K';
  }
  return volume.toFixed(2);
}

export function formatTimeHHMMSS(timestamp: number): string {
  const d = new Date(timestamp);
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  const ss = String(d.getSeconds()).padStart(2, '0');
  return `${hh}:${mm}:${ss}`;
}

export function formatDateTime(timestamp: number): string {
  const d = new Date(timestamp);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  const ss = String(d.getSeconds()).padStart(2, '0');
  return `${year}-${month}-${day} ${hh}:${mm}:${ss}`;
}
