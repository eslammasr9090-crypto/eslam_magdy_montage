import type { ItemPresets, MaounTypes, SheetPresets } from './types';

export const ITEM_PRESETS: ItemPresets = {
  A5: { w: 21, h: 14.8 },
  A4: { w: 29.7, h: 21 },
  A6: { w: 14.8, h: 10.5 },
  DL: { w: 21, h: 9.9 },
  BC: { w: 9, h: 5 },
};

export const SHEET_PRESETS: SheetPresets = {
  // Digital Printing (SRA3 based)
  SRA3: { w: 48.7, h: 33 },
  SRA3_32_45: { w: 45, h: 32 },
  SRA3_LONG: { w: 70, h: 33 },
  SRA3_X_LONG: { w: 100, h: 33 },
  SRA3_BANNER: { w: 120, h: 33 },

  // Offset & Commercial (Egypt/Regional standard)
  FULL_SHEET_100_70: { w: 100, h: 70 },
  HALF_SHEET_70_50: { w: 70, h: 50 },
  QUARTER_SHEET_50_35: { w: 50, h: 35 },
  OFFSET_57_82: { w: 82, h: 57 },
  OFFSET_60_90: { w: 90, h: 60 },

  // ISO A Series
  A0: { w: 118.9, h: 84.1 },
  A1: { w: 84.1, h: 59.4 },
  A2: { w: 59.4, h: 42 },
  A3: { w: 42, h: 29.7 },
  A4: { w: 29.7, h: 21 },

  // ISO B Series
  B0: { w: 141.4, h: 100 },
  B1: { w: 100, h: 70 },
  B2: { w: 70, h: 50 },
  B3: { w: 50, h: 35.3 },
  B4: { w: 35.3, h: 25 },

  // US Standard (Approximate to CM)
  LETTER: { w: 27.9, h: 21.6 },
  LEGAL: { w: 35.6, h: 21.6 },
  TABLOID: { w: 43.2, h: 27.9 },
};

export const MAOUN_TYPES: MaounTypes = {
  heavy: { name: '300–350جم', smallPerMaoun: 400 },
  light: { name: '150–170جم', smallPerMaoun: 1000 },
};

export const BANNER_ROLLS = [112, 137, 160, 220, 320, 420, 500];
export const STICKER_ROLLS = [104, 124, 134, 148];
