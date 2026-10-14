export type OrientationPreference = 'auto' | 'portrait' | 'landscape';

export interface BestFit {
  orient: 'طولي' | 'عرضي';
  cols: number;
  rows: number;
  total: number;
  leftW: string;
  leftH: string;
}

export interface MaounInfo {
    name: string;
    count: number;
}

export interface FitResult {
  best: BestFit;
  quantity: number;
  sheetsNeeded: number;
  bigSheets: number;
  maounInfo: MaounInfo | null;
}

export interface BookletResult {
  fit: BestFit;
  spreadsPerFace: number;
  pagesPerSheet: number;
  info: string;
  coverSheets: number;
  innerSheets: number;
  totalSheets: number;
  coverBigSheets: number;
  innerBigSheets: number;
  totalBigSheets: number;
  coverMaoun: number;
  innerMaoun: number;
  totalMaoun: number;
  perBig: number;
}

export interface Preset {
    w: number;
    h: number;
}

export interface ItemPresets {
    [key: string]: Preset;
}

export interface SheetPresets {
    [key: string]: Preset;
}

export interface MaounSetting {
    name: string;
    smallPerMaoun: number;
}

export interface MaounTypes {
    [key: string]: MaounSetting;
}

export interface StickerResult {
    total: number;
    sheetsNeeded: number;
    rows?: number;
    cols?: number;
    orient?: string;
    leftW?: string;
    leftH?: string;
    type: 'rect' | 'circle';
}

export type MaterialType = 'sticker' | 'banner';

export interface CalculationResults {
    strips: number;
    totalLength: number;
    designArea: number;
    printedArea: number;
    wasteArea: number;
    wastePercent: number;
    priceBefore: number;
    priceAfter: number;
    wasteCost: number;
}
