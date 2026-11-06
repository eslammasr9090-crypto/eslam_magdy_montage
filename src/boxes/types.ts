export interface CustomerQuoteInfo {
  quoteNumber: string;
  clientName: string;
  clientPhone: string;
  quoteDate: string;
  boxName: string;
  boxQuantity: number;
  profitMarginPercent: number;
  includeVat: boolean;
  notes: string;
}

export interface SavedQuotation {
  id: string;
  createdAt: string;
  state: {
    info: CustomerQuoteInfo;
    pricing: BoxPricingState;
  };
  breakdown: {
    subTotal: number;
    profitAmount: number;
    vatAmount: number;
    grandTotal: number;
  };
}

export interface BoxPricingState {
  // بيانات الشيت والإنتاج
  paperSize: string;
  customWidth?: number;
  customHeight?: number;
  boxesPerSheet: number;
  orderQuantity: number;
  requiredSheets: number;
  bundlesQuantity: number;

  // هامش الربح
  profitMargin: number; // e.g. 20 for 20%

  // 1. تكلفة الورق
  sheetPrice: number;
  sheetsQuantity: number;
  sheetsTotal: number;

  // 2. طباعة الورق
  paperPrintingCost: number;
  paperPrintingTotal: number;

  // 2. الزنكات
  platePrice?: number;
  platesQuantity: number;
  platesTotal: number;

  // 3. السولفان
  laminationQuantity: number;
  laminationTotal: number;

  // 4. القالب / الدايكت
  dieSize: 'ربع' | 'نصف' | 'متر';
  dieTotal: number;

  // 5. التكسير
  creasingType: 'دباب' | 'سلندر';
  creasingTotal: number;

  // 6. البصمة
  embossEnabled?: boolean;
  embossClicheCost: number;
  embossQuantity: number;
  embossTotal: number;

  // 7. تغرية اللسان
  tongueOption: '1 لسان' | '2 لسان' | '3 لسان' | '4 لسان';
  tongueTotal: number;

  // 8. تغرية الأكياس
  bagEnabled?: boolean;
  bagQuantity: number;
  bagTotal: number;

  // 9. الكفراج
  coverEnabled?: boolean;
  coverClicheCost: number;
  coverQuantity: number;
  coverTotal: number;

  // 10. التقفيل
  assemblyQuantity: number;
  assemblyPricePer1000: number;
  assemblyTotal: number;

  // 11. شباك سولفان
  windowEnabled?: boolean;
  windowCount: number;
  windowPrice: number;
  windowTotal: number;

  // 12. إضافات أخرى
  extraEnabled?: boolean;
  extraDescription?: string;
  extraPrice?: number;
  extraTotal?: number;
}

export interface PricingSettings {
  // طباعة الورق
  sheetPrice: number;
  paperPrintingCost: number;

  // الزنكات
  platePrice?: number;

  // السولفان
  laminationPer1000: number;

  // القالب
  dieQuarter: number; // ربع
  dieHalf: number;    // نصف
  dieMeter: number;   // متر

  // التكسير
  creasingPlaten: number;   // دباب
  creasingCylinder: number; // سلندر

  // البصمة
  embossCliche: number;
  embossPrint: number;

  // تغرية اللسان
  tongue1: number;
  tongue2: number;
  tongue3: number;
  tongue4: number;

  // تغرية الأكياس
  bagFixed: number;

  // الكفراج
  coverCliche: number;
  coverPrint: number;

  // التقفيل
  assemblyPricePer1000: number;

  // شباك سولفان
  windowPrice: number;
}
