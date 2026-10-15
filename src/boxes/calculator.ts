import { BoxPricingState, PricingSettings } from '../types';

export const DEFAULT_PRICING_SETTINGS: PricingSettings = {
  // طباعة الورق
  sheetPrice: 2,
  paperPrintingCost: 300,

  // الزنكات
  platePrice: 100,

  // السولفان
  laminationPer1000: 400,

  // القالب
  dieQuarter: 150,
  dieHalf: 300,
  dieMeter: 600,

  // التكسير
  creasingPlaten: 100,   // دباب
  creasingCylinder: 50,  // سلندر

  // البصمة
  embossCliche: 400,
  embossPrint: 250,

  // تغرية اللسان
  tongue1: 30,
  tongue2: 60,
  tongue3: 90,
  tongue4: 120,

  // تغرية الأكياس
  bagFixed: 500,

  // الكفراج
  coverCliche: 250,
  coverPrint: 25,

  // التقفيل
  assemblyPricePer1000: 150,

  // شباك سولفان
  windowPrice: 300,
};

export function getSavedSettings(): PricingSettings {
  try {
    const saved = localStorage.getItem('box_pricing_settings');
    if (saved) {
      return { ...DEFAULT_PRICING_SETTINGS, ...JSON.parse(saved) };
    }
  } catch (e) {
    console.error('Error reading settings from localStorage', e);
  }
  return DEFAULT_PRICING_SETTINGS;
}

export function saveSettings(settings: PricingSettings): void {
  try {
    localStorage.setItem('box_pricing_settings', JSON.stringify(settings));
  } catch (e) {
    console.error('Error saving settings to localStorage', e);
  }
}

/**
 * تكلفة الورق:
 * Total = Number of Sheets * Sheet Price
 */
export function calculateSheetsTotal(
  sheets: number,
  sheetPrice?: number,
  settings?: PricingSettings
): number {
  if (!sheets || sheets <= 0) return 0;
  const cfg = settings || getSavedSettings();
  const price = sheetPrice !== undefined ? sheetPrice : (cfg.sheetPrice ?? 2);
  return sheets * price;
}

/**
 * طباعة الورق:
 * Total = Printing Price (No sheet calculation)
 */
export function calculatePaperPrintingTotal(
  paperPrintingCost?: number,
  settings?: PricingSettings
): number {
  const cfg = settings || getSavedSettings();
  const cost = paperPrintingCost !== undefined ? paperPrintingCost : (cfg.paperPrintingCost ?? 300);
  return Number(cost) || 0;
}

/**
 * الزنكات:
 * Total = Number of Plates * Plate Price
 */
export function calculatePlatesTotal(
  quantity: number,
  price?: number,
  settings?: PricingSettings
): number {
  if (!quantity || quantity <= 0) return 0;
  const cfg = settings || getSavedSettings();
  const p = price !== undefined ? price : (cfg.platePrice ?? 100);
  return quantity * p;
}

/**
 * السولفان:
 * Every 1000 sheets = laminationPer1000
 */
export function calculateLaminationTotal(quantity: number, settings?: PricingSettings): number {
  if (!quantity || quantity <= 0) return 0;
  const cfg = settings || getSavedSettings();
  const thousands = Math.ceil(quantity / 1000);
  return thousands * cfg.laminationPer1000;
}

/**
 * القالب:
 * ربع / نصف / متر
 */
export function calculateDieTotal(size: 'ربع' | 'نصف' | 'متر', settings?: PricingSettings): number {
  const cfg = settings || getSavedSettings();
  switch (size) {
    case 'ربع': return cfg.dieQuarter;
    case 'نصف': return cfg.dieHalf;
    case 'متر': return cfg.dieMeter;
    default: return cfg.dieHalf;
  }
}

/**
 * التكسير:
 * دباب / سلندر
 */
export function calculateCreasingTotal(type: 'دباب' | 'سلندر', settings?: PricingSettings): number {
  const cfg = settings || getSavedSettings();
  return type === 'دباب' ? cfg.creasingPlaten : cfg.creasingCylinder;
}

/**
 * البصمة:
 * سعر الكليشة + الطباعة
 */
export function calculateEmbossTotal(
  clicheCost?: number,
  printCost?: number,
  settings?: PricingSettings
): number {
  const cfg = settings || getSavedSettings();
  const c = clicheCost !== undefined ? clicheCost : cfg.embossCliche;
  const p = printCost !== undefined ? printCost : cfg.embossPrint;
  return (Number(c) || 0) + (Number(p) || 0);
}

/**
 * تغرية اللسان:
 * 1 / 2 / 3 / 4 لسان
 */
export function calculateTongueTotal(
  option: '1 لسان' | '2 لسان' | '3 لسان' | '4 لسان',
  settings?: PricingSettings
): number {
  const cfg = settings || getSavedSettings();
  switch (option) {
    case '1 لسان': return cfg.tongue1;
    case '2 لسان': return cfg.tongue2;
    case '3 لسان': return cfg.tongue3;
    case '4 لسان': return cfg.tongue4;
    default: return cfg.tongue2;
  }
}

/**
 * تغرية الأكياس:
 * سعر ثابت
 */
export function calculateBagTotal(settings?: PricingSettings): number {
  const cfg = settings || getSavedSettings();
  return cfg.bagFixed;
}

/**
 * الكفراج:
 * سعر الكليشة + الطباعة
 */
export function calculateCoverTotal(
  clicheCost?: number,
  printCost?: number,
  settings?: PricingSettings
): number {
  const cfg = settings || getSavedSettings();
  const c = clicheCost !== undefined ? clicheCost : cfg.coverCliche;
  const p = printCost !== undefined ? printCost : cfg.coverPrint;
  return (Number(c) || 0) + (Number(p) || 0);
}

/**
 * التقفيل:
 * Total = (Math.ceil(quantity / 1000)) * pricePer1000
 */
export function calculateAssemblyTotal(quantity: number, pricePer1000: number): number {
  if (!quantity || quantity <= 0) return 0;
  const thousands = Math.ceil(quantity / 1000);
  return thousands * (pricePer1000 || 0);
}

/**
 * شباك سولفان:
 * Total = count * price
 */
export function calculateWindowTotal(count: number, price: number): number {
  if (!count || count <= 0) return 0;
  return count * (price || 0);
}

export function calculateRequiredSheets(orderQuantity: number, boxesPerSheet: number): number {
  if (!boxesPerSheet || boxesPerSheet <= 0) return 0;
  if (!orderQuantity || orderQuantity <= 0) return 0;
  return Math.ceil(orderQuantity / boxesPerSheet);
}

export function calculateBundlesQuantity(requiredSheets: number): number {
  if (!requiredSheets || requiredSheets <= 0) return 0;
  return Math.ceil(requiredSheets / 100);
}

export function getInitialStateWithSettings(settings?: PricingSettings): BoxPricingState {
  const cfg = settings || getSavedSettings();
  const paperSize = '70×100';
  const boxesPerSheet = 2;
  const orderQuantity = 1000;
  const requiredSheets = calculateRequiredSheets(orderQuantity, boxesPerSheet);
  const bundlesQuantity = calculateBundlesQuantity(requiredSheets);

  return {
    paperSize,
    boxesPerSheet,
    orderQuantity,
    requiredSheets,
    bundlesQuantity,

    profitMargin: 25, // 25% default profit margin

    // 1. تكلفة الورق
    sheetPrice: cfg.sheetPrice ?? 2,
    sheetsQuantity: requiredSheets,
    sheetsTotal: calculateSheetsTotal(requiredSheets, cfg.sheetPrice ?? 2, cfg),

    // 2. طباعة الورق
    paperPrintingCost: cfg.paperPrintingCost ?? 300,
    paperPrintingTotal: calculatePaperPrintingTotal(cfg.paperPrintingCost ?? 300, cfg),

    // 2. الزنكات
    platePrice: cfg.platePrice ?? 100,
    platesQuantity: 4,
    platesTotal: calculatePlatesTotal(4, cfg.platePrice ?? 100, cfg),

    // 3. السولفان
    laminationQuantity: requiredSheets,
    laminationTotal: calculateLaminationTotal(requiredSheets, cfg),

    // 4. القالب / الدايكت
    dieSize: 'نصف',
    dieTotal: calculateDieTotal('نصف', cfg),

    // 5. التكسير
    creasingType: 'دباب',
    creasingTotal: calculateCreasingTotal('دباب', cfg),

    // 6. البصمة
    embossEnabled: false,
    embossClicheCost: cfg.embossCliche,
    embossQuantity: 1000,
    embossTotal: calculateEmbossTotal(cfg.embossCliche, cfg.embossPrint, cfg),

    // 7. تغرية اللسان
    tongueOption: '2 لسان',
    tongueTotal: calculateTongueTotal('2 لسان', cfg),

    // 8. تغرية الأكياس
    bagEnabled: false,
    bagQuantity: 500,
    bagTotal: calculateBagTotal(cfg),

    // 9. الكفراج
    coverEnabled: false,
    coverClicheCost: cfg.coverCliche,
    coverQuantity: 1000,
    coverTotal: calculateCoverTotal(cfg.coverCliche, cfg.coverPrint, cfg),

    // 10. التقفيل
    assemblyQuantity: orderQuantity,
    assemblyPricePer1000: cfg.assemblyPricePer1000,
    assemblyTotal: calculateAssemblyTotal(orderQuantity, cfg.assemblyPricePer1000),

    // 11. شباك سولفان
    windowEnabled: false,
    windowCount: 0,
    windowPrice: cfg.windowPrice,
    windowTotal: 0,

    // 12. إضافات أخرى
    extraEnabled: false,
    extraDescription: '',
    extraPrice: 0,
    extraTotal: 0,
  };
}

export const INITIAL_BOX_PRICING_STATE: BoxPricingState = getInitialStateWithSettings();

export function calculateGrandTotal(state: BoxPricingState): number {
  return (
    (Number(state.sheetsTotal) || 0) +
    (Number(state.paperPrintingTotal) || 0) +
    (Number(state.platesTotal) || 0) +
    (Number(state.laminationTotal) || 0) +
    (Number(state.dieTotal) || 0) +
    (Number(state.creasingTotal) || 0) +
    (state.embossEnabled ? (Number(state.embossTotal) || 0) : 0) +
    (Number(state.tongueTotal) || 0) +
    (state.bagEnabled ? (Number(state.bagTotal) || 0) : 0) +
    (state.coverEnabled ? (Number(state.coverTotal) || 0) : 0) +
    (Number(state.assemblyTotal) || 0) +
    (state.windowEnabled ? (Number(state.windowTotal) || 0) : 0) +
    (state.extraEnabled ? (Number(state.extraTotal ?? state.extraPrice) || 0) : 0)
  );
}

export function formatNumber(val: number): string {
  if (isNaN(val) || val === null || val === undefined) return '0';
  const rounded = Math.round(val);
  return rounded.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

export function formatDecimalNumber(val: number, decimals: number = 3): string {
  if (isNaN(val) || val === null || val === undefined) return '0';
  // Standard format with dots/commas
  return val.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  }).replace(/,/g, '.');
}

export function formatCurrencySAR(val: number): string {
  if (isNaN(val) || val === null || val === undefined) return '0';
  return val.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
}
