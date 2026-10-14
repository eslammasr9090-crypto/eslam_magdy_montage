import type { BestFit, OrientationPreference } from '../types';

export function bestFit(
  pW: number, 
  pH: number, 
  iW: number, 
  iH: number, 
  margin: number = 0, 
  gutter: number = 0,
  preference: OrientationPreference = 'auto'
): BestFit {
  const usableW = pW - 2 * margin;
  const usableH = pH - 2 * margin;

  if (usableW <= 0 || usableH <= 0 || iW <= 0 || iH <= 0) {
      return { orient: 'طولي', cols: 0, rows: 0, total: 0, leftW: '0.00', leftH: '0.00' };
  }

  // Calculation for Portrait orientation (Item stays as iW x iH)
  const calcPortrait = () => {
    const cols = Math.floor((usableW + gutter) / (iW + gutter));
    const rows = Math.floor((usableH + gutter) / (iH + gutter));
    const total = Math.max(0, cols) * Math.max(0, rows);
    const usedW = total > 0 ? (cols * iW + (cols - 1) * gutter) : 0;
    const usedH = total > 0 ? (rows * iH + (rows - 1) * gutter) : 0;
    return {
      orient: 'طولي' as const,
      cols,
      rows,
      total,
      leftW: Math.max(0, usableW - usedW).toFixed(2),
      leftH: Math.max(0, usableH - usedH).toFixed(2),
    };
  };

  // Calculation for Landscape orientation (Item is rotated to iH x iW)
  const calcLandscape = () => {
    const cols = Math.floor((usableW + gutter) / (iH + gutter));
    const rows = Math.floor((usableH + gutter) / (iW + gutter));
    const total = Math.max(0, cols) * Math.max(0, rows);
    const usedW = total > 0 ? (cols * iH + (cols - 1) * gutter) : 0;
    const usedH = total > 0 ? (rows * iW + (rows - 1) * gutter) : 0;
    return {
      orient: 'عرضي' as const,
      cols,
      rows,
      total,
      leftW: Math.max(0, usableW - usedW).toFixed(2),
      leftH: Math.max(0, usableH - usedH).toFixed(2),
    };
  };

  if (preference === 'portrait') return calcPortrait();
  if (preference === 'landscape') return calcLandscape();

  // 'auto' logic: return the one with the higher total
  const res1 = calcPortrait();
  const res2 = calcLandscape();

  return res2.total > res1.total ? res2 : res1;
}

export function smallPerBig100x70(smallW: number, smallH: number): number {
    if (smallW <= 0 || smallH <= 0) return 0;
    const fit1 = Math.floor(100 / smallW) * Math.floor(70 / smallH);
    const fit2 = Math.floor(100 / smallH) * Math.floor(70 / smallW);
    return Math.max(fit1, fit2, 1); // Return at least 1 if it fits at all
}