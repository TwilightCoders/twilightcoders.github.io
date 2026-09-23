// Pure number formatting shared by the pages. No imports, so node:test can load it directly.

/** Round down to a clean figure for "over N" claims: 571,992 → 570,000. */
export function floorFigure(n: number): number {
  const step = n >= 100_000 ? 10_000 : n >= 10_000 ? 1_000 : n >= 1_000 ? 100 : 10;
  return Math.floor(n / step) * step;
}

/** Short counts for card metadata: 954 → "954", 1,680 → "1.7k", 54,116 → "54k". */
export function compact(n: number): string {
  if (n < 1000) return String(n);
  return `${(n / 1000).toFixed(n >= 10_000 ? 0 : 1).replace(/\.0$/, '')}k`;
}
