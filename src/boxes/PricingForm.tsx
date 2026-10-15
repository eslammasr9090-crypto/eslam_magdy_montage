import React from 'react';
import { BoxPricingState } from '../types';
import { ProductionInfoCard } from './ProductionInfoCard';
import {
  calculateSheetsTotal,
  calculatePaperPrintingTotal,
  calculatePlatesTotal,
  calculateLaminationTotal,
  calculateDieTotal,
  calculateCreasingTotal,
  calculateEmbossTotal,
  calculateTongueTotal,
  calculateBagTotal,
  calculateCoverTotal,
  calculateAssemblyTotal,
  calculateWindowTotal,
  getSavedSettings,
} from '../utils/calculator';
import {
  FileText,
  Printer,
  Layers,
  Sparkles,
  Scissors,
  Settings2,
  Stamp,
  Droplet,
  ShoppingBag,
  BookOpen,
  BoxSelect,
  AppWindow,
  PlusCircle,
} from 'lucide-react';

interface PricingFormProps {
  state: BoxPricingState;
  onChange: (updatedState: BoxPricingState) => void;
}

export const PricingForm: React.FC<PricingFormProps> = ({ state, onChange }) => {
  const updateField = <K extends keyof BoxPricingState>(field: K, value: BoxPricingState[K]) => {
    let nextState = {
      ...state,
      [field]: value,
    };

    const settings = getSavedSettings();

    // Auto calculate dependent totals based on field changes
    if (field === 'sheetsQuantity' || field === 'sheetPrice') {
      const qty = field === 'sheetsQuantity' ? (value as number) : (nextState.sheetsQuantity || 0);
      const price = field === 'sheetPrice' ? (value as number) : (nextState.sheetPrice ?? settings.sheetPrice ?? 2);
      nextState.sheetsTotal = calculateSheetsTotal(qty, price, settings);
    } else if (field === 'paperPrintingCost') {
      const cost = value as number;
      nextState.paperPrintingTotal = calculatePaperPrintingTotal(cost, settings);
    } else if (field === 'platesQuantity' || field === 'platePrice') {
      const qty = field === 'platesQuantity' ? (value as number) : (nextState.platesQuantity || 0);
      const price = field === 'platePrice' ? (value as number) : (nextState.platePrice ?? settings.platePrice ?? 100);
      nextState.platesTotal = calculatePlatesTotal(qty, price, settings);
    } else if (field === 'laminationQuantity') {
      nextState.laminationTotal = calculateLaminationTotal(value as number, settings);
    } else if (field === 'dieSize') {
      nextState.dieTotal = calculateDieTotal(value as any, settings);
    } else if (field === 'creasingType') {
      nextState.creasingTotal = calculateCreasingTotal(value as any, settings);
    } else if (field === 'embossClicheCost' || field === 'embossQuantity') {
      const cliche = field === 'embossClicheCost' ? (value as number) : nextState.embossClicheCost;
      const printCost = (nextState.embossQuantity || 0) > 0 ? settings.embossPrint : 0;
      nextState.embossTotal = calculateEmbossTotal(cliche, printCost, settings);
    } else if (field === 'tongueOption') {
      nextState.tongueTotal = calculateTongueTotal(value as any, settings);
    } else if (field === 'bagQuantity') {
      nextState.bagTotal = (value as number) > 0 ? calculateBagTotal(settings) : 0;
    } else if (field === 'coverClicheCost' || field === 'coverQuantity') {
      const cliche = field === 'coverClicheCost' ? (value as number) : nextState.coverClicheCost;
      const printCost = (nextState.coverQuantity || 0) > 0 ? settings.coverPrint : 0;
      nextState.coverTotal = calculateCoverTotal(cliche, printCost, settings);
    } else if (field === 'assemblyQuantity' || field === 'assemblyPricePer1000') {
      const qty = field === 'assemblyQuantity' ? (value as number) : (nextState.assemblyQuantity || 0);
      const price = field === 'assemblyPricePer1000' ? (value as number) : (nextState.assemblyPricePer1000 || 0);
      nextState.assemblyTotal = calculateAssemblyTotal(qty, price);
    } else if (field === 'windowCount' || field === 'windowPrice') {
      const count = field === 'windowCount' ? (value as number) : (nextState.windowCount || 0);
      const price = field === 'windowPrice' ? (value as number) : (nextState.windowPrice || 0);
      nextState.windowTotal = calculateWindowTotal(count, price);
    } else if (field === 'extraPrice') {
      const price = value as number;
      nextState.extraTotal = price;
    }

    onChange(nextState);
  };

  return (
    <div>
      {/* Production Information Card at Top */}
      <ProductionInfoCard state={state} onChange={onChange} />

      {/* Services Grid Header */}
      <div className="mb-4">
        <h3 className="text-lg font-bold text-slate-800">تفاصيل الخدمات والتكاليف</h3>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        
        {/* 1. تكلفة الورق */}
        <div className="bg-white border border-[#D9E3F0] rounded-2xl p-5 shadow-sm hover:border-[#0D6EFD] transition-all">
          <div className="flex items-center gap-3 mb-4 pb-3 border-b border-[#D9E3F0]">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0D6EFD] flex items-center justify-center font-bold">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-base">تكلفة الورق</h3>
              <p className="text-xs text-slate-500">حساب تكلفة الورق</p>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">عدد الشيتات</label>
              <input
                type="number"
                min="0"
                value={state.sheetsQuantity || ''}
                onChange={(e) => updateField('sheetsQuantity', parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-50 border border-[#D9E3F0] rounded-xl px-3.5 py-2.5 text-sm text-slate-800 font-bold focus:outline-none focus:border-[#0D6EFD] focus:bg-white transition-all"
                placeholder="500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">سعر الشيت</label>
              <input
                type="number"
                min="0"
                step="any"
                value={state.sheetPrice ?? 2}
                onChange={(e) => updateField('sheetPrice', parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-50 border border-[#D9E3F0] rounded-xl px-3.5 py-2.5 text-sm text-slate-800 font-bold focus:outline-none focus:border-[#0D6EFD] focus:bg-white transition-all"
                placeholder="2"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">الإجمالي</label>
              <input
                type="number"
                min="0"
                value={state.sheetsTotal || ''}
                onChange={(e) => updateField('sheetsTotal', parseFloat(e.target.value) || 0)}
                className="w-full bg-blue-50/50 border border-[#0D6EFD]/30 rounded-xl px-3.5 py-2.5 text-sm text-[#0D6EFD] font-extrabold focus:outline-none focus:border-[#0D6EFD] focus:bg-white transition-all"
                placeholder="1000"
              />
              <p className="text-[11px] text-blue-600 font-medium mt-1">
                (تم احتساب السعر تلقائياً)
              </p>
            </div>
          </div>
        </div>

        {/* 2. طباعة الورق */}
        <div className="bg-white border border-[#D9E3F0] rounded-2xl p-5 shadow-sm hover:border-[#0D6EFD] transition-all">
          <div className="flex items-center gap-3 mb-4 pb-3 border-b border-[#D9E3F0]">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0D6EFD] flex items-center justify-center font-bold">
              <Printer className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-base">طباعة الورق</h3>
              <p className="text-xs text-slate-500">تكلفة طباعة الورق</p>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">سعر الطباعة</label>
              <input
                type="number"
                min="0"
                step="any"
                value={state.paperPrintingCost ?? 300}
                onChange={(e) => updateField('paperPrintingCost', parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-50 border border-[#D9E3F0] rounded-xl px-3.5 py-2.5 text-sm text-slate-800 font-bold focus:outline-none focus:border-[#0D6EFD] focus:bg-white transition-all"
                placeholder="300"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">الإجمالي</label>
              <input
                type="number"
                min="0"
                value={state.paperPrintingTotal ?? state.paperPrintingCost ?? 300}
                onChange={(e) => {
                  const val = parseFloat(e.target.value) || 0;
                  updateField('paperPrintingTotal', val);
                  updateField('paperPrintingCost', val);
                }}
                className="w-full bg-blue-50/50 border border-[#0D6EFD]/30 rounded-xl px-3.5 py-2.5 text-sm text-[#0D6EFD] font-extrabold focus:outline-none focus:border-[#0D6EFD] focus:bg-white transition-all"
                placeholder="300"
              />
              <p className="text-[11px] text-blue-600 font-medium mt-1">
                (سعر الطباعة الثابت)
              </p>
            </div>
          </div>
        </div>

        {/* 2. الزنكات */}
        <div className="bg-white border border-[#D9E3F0] rounded-2xl p-5 shadow-sm hover:border-[#0D6EFD] transition-all">
          <div className="flex items-center gap-3 mb-4 pb-3 border-b border-[#D9E3F0]">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0D6EFD] flex items-center justify-center font-bold">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-base">الزنكات</h3>
              <p className="text-xs text-slate-500">تكلفة ألواح الزنكات</p>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">عدد الزنكات</label>
              <input
                type="number"
                min="0"
                value={state.platesQuantity || ''}
                onChange={(e) => updateField('platesQuantity', parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-50 border border-[#D9E3F0] rounded-xl px-3.5 py-2.5 text-sm text-slate-800 font-bold focus:outline-none focus:border-[#0D6EFD] focus:bg-white transition-all"
                placeholder="4"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">سعر الزنكة</label>
              <input
                type="number"
                min="0"
                step="any"
                value={state.platePrice ?? 100}
                onChange={(e) => updateField('platePrice', parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-50 border border-[#D9E3F0] rounded-xl px-3.5 py-2.5 text-sm text-slate-800 font-bold focus:outline-none focus:border-[#0D6EFD] focus:bg-white transition-all"
                placeholder="100"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">الإجمالي</label>
              <input
                type="number"
                min="0"
                value={state.platesTotal || ''}
                onChange={(e) => updateField('platesTotal', parseFloat(e.target.value) || 0)}
                className="w-full bg-blue-50/50 border border-[#0D6EFD]/30 rounded-xl px-3.5 py-2.5 text-sm text-[#0D6EFD] font-extrabold focus:outline-none focus:border-[#0D6EFD] focus:bg-white transition-all"
                placeholder="400"
              />
              <p className="text-[11px] text-blue-600 font-medium mt-1">
                (تم احتساب السعر تلقائياً)
              </p>
            </div>
          </div>
        </div>

        {/* 3. السولفان */}
        <div className="bg-white border border-[#D9E3F0] rounded-2xl p-5 shadow-sm hover:border-[#0D6EFD] transition-all">
          <div className="flex items-center gap-3 mb-4 pb-3 border-b border-[#D9E3F0]">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0D6EFD] flex items-center justify-center font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-base">السولفان</h3>
              <p className="text-xs text-slate-500">تكلفة التغليف بالسولفان</p>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">الكمية</label>
              <input
                type="number"
                min="0"
                value={state.laminationQuantity || ''}
                onChange={(e) => updateField('laminationQuantity', parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-50 border border-[#D9E3F0] rounded-xl px-3.5 py-2.5 text-sm text-slate-800 font-bold focus:outline-none focus:border-[#0D6EFD] focus:bg-white transition-all"
                placeholder="1250"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">الإجمالي</label>
              <input
                type="number"
                min="0"
                value={state.laminationTotal || ''}
                onChange={(e) => updateField('laminationTotal', parseFloat(e.target.value) || 0)}
                className="w-full bg-blue-50/50 border border-[#0D6EFD]/30 rounded-xl px-3.5 py-2.5 text-sm text-[#0D6EFD] font-extrabold focus:outline-none focus:border-[#0D6EFD] focus:bg-white transition-all"
                placeholder="400"
              />
              <p className="text-[11px] text-blue-600 font-medium mt-1">
                (تم احتساب السعر تلقائياً)
              </p>
            </div>
          </div>
        </div>

        {/* 4. الدايكت / القالب */}
        <div className="bg-white border border-[#D9E3F0] rounded-2xl p-5 shadow-sm hover:border-[#0D6EFD] transition-all">
          <div className="flex items-center gap-3 mb-4 pb-3 border-b border-[#D9E3F0]">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0D6EFD] flex items-center justify-center font-bold">
              <Scissors className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-base">الدايكت / القالب</h3>
              <p className="text-xs text-slate-500">قالب وقورمة التكسير</p>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">المقاس</label>
              <select
                value={state.dieSize}
                onChange={(e) => updateField('dieSize', e.target.value as any)}
                className="w-full bg-slate-50 border border-[#D9E3F0] rounded-xl px-3.5 py-2.5 text-sm text-slate-800 font-bold focus:outline-none focus:border-[#0D6EFD] focus:bg-white transition-all cursor-pointer"
              >
                <option value="ربع">ربع</option>
                <option value="نصف">نصف</option>
                <option value="متر">متر</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">الإجمالي</label>
              <input
                type="number"
                min="0"
                value={state.dieTotal || ''}
                onChange={(e) => updateField('dieTotal', parseFloat(e.target.value) || 0)}
                className="w-full bg-blue-50/50 border border-[#0D6EFD]/30 rounded-xl px-3.5 py-2.5 text-sm text-[#0D6EFD] font-extrabold focus:outline-none focus:border-[#0D6EFD] focus:bg-white transition-all"
                placeholder="300"
              />
              <p className="text-[11px] text-blue-600 font-medium mt-1">
                (تم احتساب السعر تلقائياً)
              </p>
            </div>
          </div>
        </div>

        {/* 5. التكسير */}
        <div className="bg-white border border-[#D9E3F0] rounded-2xl p-5 shadow-sm hover:border-[#0D6EFD] transition-all">
          <div className="flex items-center gap-3 mb-4 pb-3 border-b border-[#D9E3F0]">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0D6EFD] flex items-center justify-center font-bold">
              <Settings2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-base">التكسير</h3>
              <p className="text-xs text-slate-500">عملية التكسير</p>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">النوع</label>
              <select
                value={state.creasingType}
                onChange={(e) => updateField('creasingType', e.target.value as any)}
                className="w-full bg-slate-50 border border-[#D9E3F0] rounded-xl px-3.5 py-2.5 text-sm text-slate-800 font-bold focus:outline-none focus:border-[#0D6EFD] focus:bg-white transition-all cursor-pointer"
              >
                <option value="دباب">دباب</option>
                <option value="سلندر">سلندر</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">الإجمالي</label>
              <input
                type="number"
                min="0"
                value={state.creasingTotal || ''}
                onChange={(e) => updateField('creasingTotal', parseFloat(e.target.value) || 0)}
                className="w-full bg-blue-50/50 border border-[#0D6EFD]/30 rounded-xl px-3.5 py-2.5 text-sm text-[#0D6EFD] font-extrabold focus:outline-none focus:border-[#0D6EFD] focus:bg-white transition-all"
                placeholder="100"
              />
              <p className="text-[11px] text-blue-600 font-medium mt-1">
                (تم احتساب السعر تلقائياً)
              </p>
            </div>
          </div>
        </div>

        {/* 6. البصمة */}
        <div className={`bg-white border border-[#D9E3F0] rounded-2xl p-5 shadow-sm transition-all ${
          state.embossEnabled ? 'hover:border-[#0D6EFD]' : 'opacity-60 bg-slate-50/50'
        }`}>
          <div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b border-[#D9E3F0]">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold transition-colors ${
                state.embossEnabled ? 'bg-blue-50 text-[#0D6EFD]' : 'bg-slate-100 text-slate-400'
              }`}>
                <Stamp className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-base">البصمة</h3>
                <p className="text-xs text-slate-500">كليشة + طباعة</p>
              </div>
            </div>
            <label className="flex items-center gap-2 cursor-pointer select-none text-xs font-bold text-[#0D6EFD] bg-blue-50/80 hover:bg-blue-100/80 px-3 py-1.5 rounded-xl border border-blue-200/60 transition-colors">
              <input
                type="checkbox"
                checked={!!state.embossEnabled}
                onChange={(e) => updateField('embossEnabled', e.target.checked)}
                className="w-4 h-4 rounded text-[#0D6EFD] focus:ring-[#0D6EFD] cursor-pointer"
              />
              <span>تفعيل البصمة</span>
            </label>
          </div>

          <div className={`space-y-3 transition-opacity ${state.embossEnabled ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">سعر الكليشة</label>
              <input
                type="number"
                min="0"
                disabled={!state.embossEnabled}
                value={state.embossClicheCost || ''}
                onChange={(e) => updateField('embossClicheCost', parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-50 border border-[#D9E3F0] rounded-xl px-3.5 py-2.5 text-sm text-slate-800 font-bold focus:outline-none focus:border-[#0D6EFD] focus:bg-white transition-all disabled:bg-slate-100 disabled:text-slate-400"
                placeholder="400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">كمية الطباعة</label>
              <input
                type="number"
                min="0"
                disabled={!state.embossEnabled}
                value={state.embossQuantity || ''}
                onChange={(e) => updateField('embossQuantity', parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-50 border border-[#D9E3F0] rounded-xl px-3.5 py-2.5 text-sm text-slate-800 font-bold focus:outline-none focus:border-[#0D6EFD] focus:bg-white transition-all disabled:bg-slate-100 disabled:text-slate-400"
                placeholder="1000"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">الإجمالي</label>
              <input
                type="number"
                min="0"
                disabled={!state.embossEnabled}
                value={state.embossTotal || ''}
                onChange={(e) => updateField('embossTotal', parseFloat(e.target.value) || 0)}
                className="w-full bg-blue-50/50 border border-[#0D6EFD]/30 rounded-xl px-3.5 py-2.5 text-sm text-[#0D6EFD] font-extrabold focus:outline-none focus:border-[#0D6EFD] focus:bg-white transition-all disabled:bg-slate-100 disabled:text-slate-400"
                placeholder="650"
              />
              <p className="text-[11px] text-blue-600 font-medium mt-1">
                (تم احتساب السعر تلقائياً)
              </p>
            </div>
          </div>
        </div>

        {/* 7. تغرية اللسان */}
        <div className="bg-white border border-[#D9E3F0] rounded-2xl p-5 shadow-sm hover:border-[#0D6EFD] transition-all">
          <div className="flex items-center gap-3 mb-4 pb-3 border-b border-[#D9E3F0]">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0D6EFD] flex items-center justify-center font-bold">
              <Droplet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-base">تغرية اللسان</h3>
              <p className="text-xs text-slate-500">تغرية ألسنة العلبة</p>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">اختيار</label>
              <select
                value={state.tongueOption}
                onChange={(e) => updateField('tongueOption', e.target.value as any)}
                className="w-full bg-slate-50 border border-[#D9E3F0] rounded-xl px-3.5 py-2.5 text-sm text-slate-800 font-bold focus:outline-none focus:border-[#0D6EFD] focus:bg-white transition-all cursor-pointer"
              >
                <option value="1 لسان">1 لسان</option>
                <option value="2 لسان">2 لسان</option>
                <option value="3 لسان">3 لسان</option>
                <option value="4 لسان">4 لسان</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">الإجمالي</label>
              <input
                type="number"
                min="0"
                value={state.tongueTotal || ''}
                onChange={(e) => updateField('tongueTotal', parseFloat(e.target.value) || 0)}
                className="w-full bg-blue-50/50 border border-[#0D6EFD]/30 rounded-xl px-3.5 py-2.5 text-sm text-[#0D6EFD] font-extrabold focus:outline-none focus:border-[#0D6EFD] focus:bg-white transition-all"
                placeholder="60"
              />
              <p className="text-[11px] text-blue-600 font-medium mt-1">
                (تم احتساب السعر تلقائياً)
              </p>
            </div>
          </div>
        </div>

        {/* 8. تغرية الأكياس */}
        <div className={`bg-white border border-[#D9E3F0] rounded-2xl p-5 shadow-sm transition-all ${
          state.bagEnabled ? 'hover:border-[#0D6EFD]' : 'opacity-60 bg-slate-50/50'
        }`}>
          <div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b border-[#D9E3F0]">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold transition-colors ${
                state.bagEnabled ? 'bg-blue-50 text-[#0D6EFD]' : 'bg-slate-100 text-slate-400'
              }`}>
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-base">تغرية الأكياس</h3>
                <p className="text-xs text-slate-500">تجميع وتغرية الأكياس</p>
              </div>
            </div>
            <label className="flex items-center gap-2 cursor-pointer select-none text-xs font-bold text-[#0D6EFD] bg-blue-50/80 hover:bg-blue-100/80 px-3 py-1.5 rounded-xl border border-blue-200/60 transition-colors">
              <input
                type="checkbox"
                checked={!!state.bagEnabled}
                onChange={(e) => updateField('bagEnabled', e.target.checked)}
                className="w-4 h-4 rounded text-[#0D6EFD] focus:ring-[#0D6EFD] cursor-pointer"
              />
              <span>تفعيل تغرية الأكياس</span>
            </label>
          </div>

          <div className={`space-y-3 transition-opacity ${state.bagEnabled ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">الكمية</label>
              <input
                type="number"
                min="0"
                disabled={!state.bagEnabled}
                value={state.bagQuantity || ''}
                onChange={(e) => updateField('bagQuantity', parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-50 border border-[#D9E3F0] rounded-xl px-3.5 py-2.5 text-sm text-slate-800 font-bold focus:outline-none focus:border-[#0D6EFD] focus:bg-white transition-all disabled:bg-slate-100 disabled:text-slate-400"
                placeholder="500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">الإجمالي</label>
              <input
                type="number"
                min="0"
                disabled={!state.bagEnabled}
                value={state.bagTotal || ''}
                onChange={(e) => updateField('bagTotal', parseFloat(e.target.value) || 0)}
                className="w-full bg-blue-50/50 border border-[#0D6EFD]/30 rounded-xl px-3.5 py-2.5 text-sm text-[#0D6EFD] font-extrabold focus:outline-none focus:border-[#0D6EFD] focus:bg-white transition-all disabled:bg-slate-100 disabled:text-slate-400"
                placeholder="500"
              />
              <p className="text-[11px] text-blue-600 font-medium mt-1">
                (تم احتساب السعر تلقائياً)
              </p>
            </div>
          </div>
        </div>

        {/* 9. الكفراج */}
        <div className={`bg-white border border-[#D9E3F0] rounded-2xl p-5 shadow-sm transition-all ${
          state.coverEnabled ? 'hover:border-[#0D6EFD]' : 'opacity-60 bg-slate-50/50'
        }`}>
          <div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b border-[#D9E3F0]">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold transition-colors ${
                state.coverEnabled ? 'bg-blue-50 text-[#0D6EFD]' : 'bg-slate-100 text-slate-400'
              }`}>
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-base">الكفراج</h3>
                <p className="text-xs text-slate-500">كليشة + طباعة</p>
              </div>
            </div>
            <label className="flex items-center gap-2 cursor-pointer select-none text-xs font-bold text-[#0D6EFD] bg-blue-50/80 hover:bg-blue-100/80 px-3 py-1.5 rounded-xl border border-blue-200/60 transition-colors">
              <input
                type="checkbox"
                checked={!!state.coverEnabled}
                onChange={(e) => updateField('coverEnabled', e.target.checked)}
                className="w-4 h-4 rounded text-[#0D6EFD] focus:ring-[#0D6EFD] cursor-pointer"
              />
              <span>تفعيل الكفراج</span>
            </label>
          </div>

          <div className={`space-y-3 transition-opacity ${state.coverEnabled ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">سعر الكليشة</label>
              <input
                type="number"
                min="0"
                disabled={!state.coverEnabled}
                value={state.coverClicheCost || ''}
                onChange={(e) => updateField('coverClicheCost', parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-50 border border-[#D9E3F0] rounded-xl px-3.5 py-2.5 text-sm text-slate-800 font-bold focus:outline-none focus:border-[#0D6EFD] focus:bg-white transition-all disabled:bg-slate-100 disabled:text-slate-400"
                placeholder="250"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">كمية الطباعة</label>
              <input
                type="number"
                min="0"
                disabled={!state.coverEnabled}
                value={state.coverQuantity || ''}
                onChange={(e) => updateField('coverQuantity', parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-50 border border-[#D9E3F0] rounded-xl px-3.5 py-2.5 text-sm text-slate-800 font-bold focus:outline-none focus:border-[#0D6EFD] focus:bg-white transition-all disabled:bg-slate-100 disabled:text-slate-400"
                placeholder="1000"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">الإجمالي</label>
              <input
                type="number"
                min="0"
                disabled={!state.coverEnabled}
                value={state.coverTotal || ''}
                onChange={(e) => updateField('coverTotal', parseFloat(e.target.value) || 0)}
                className="w-full bg-blue-50/50 border border-[#0D6EFD]/30 rounded-xl px-3.5 py-2.5 text-sm text-[#0D6EFD] font-extrabold focus:outline-none focus:border-[#0D6EFD] focus:bg-white transition-all disabled:bg-slate-100 disabled:text-slate-400"
                placeholder="275"
              />
              <p className="text-[11px] text-blue-600 font-medium mt-1">
                (تم احتساب السعر تلقائياً)
              </p>
            </div>
          </div>
        </div>

        {/* 10. التقفيل */}
        <div className="bg-white border border-[#D9E3F0] rounded-2xl p-5 shadow-sm hover:border-[#0D6EFD] transition-all">
          <div className="flex items-center gap-3 mb-4 pb-3 border-b border-[#D9E3F0]">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0D6EFD] flex items-center justify-center font-bold">
              <BoxSelect className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-base">التقفيل</h3>
              <p className="text-xs text-slate-500">تكلفة تجميع وتقفيل البوكسات</p>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">الكمية</label>
              <input
                type="number"
                min="0"
                value={state.assemblyQuantity || ''}
                onChange={(e) => updateField('assemblyQuantity', parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-50 border border-[#D9E3F0] rounded-xl px-3.5 py-2.5 text-sm text-slate-800 font-bold focus:outline-none focus:border-[#0D6EFD] focus:bg-white transition-all"
                placeholder="1000"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">سعر التقفيل لكل 1000 قطعة</label>
              <input
                type="number"
                min="0"
                value={state.assemblyPricePer1000 || ''}
                onChange={(e) => updateField('assemblyPricePer1000', parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-50 border border-[#D9E3F0] rounded-xl px-3.5 py-2.5 text-sm text-slate-800 font-bold focus:outline-none focus:border-[#0D6EFD] focus:bg-white transition-all"
                placeholder="150"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">الإجمالي</label>
              <input
                type="number"
                min="0"
                value={state.assemblyTotal || ''}
                onChange={(e) => updateField('assemblyTotal', parseFloat(e.target.value) || 0)}
                className="w-full bg-blue-50/50 border border-[#0D6EFD]/30 rounded-xl px-3.5 py-2.5 text-sm text-[#0D6EFD] font-extrabold focus:outline-none focus:border-[#0D6EFD] focus:bg-white transition-all"
                placeholder="150"
              />
              <p className="text-[11px] text-blue-600 font-medium mt-1">
                (تم احتساب السعر تلقائياً)
              </p>
            </div>
          </div>
        </div>

        {/* 11. شباك سولفان */}
        <div className={`bg-white border border-[#D9E3F0] rounded-2xl p-5 shadow-sm transition-all ${
          state.windowEnabled ? 'hover:border-[#0D6EFD]' : 'opacity-60 bg-slate-50/50'
        }`}>
          <div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b border-[#D9E3F0]">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold transition-colors ${
                state.windowEnabled ? 'bg-blue-50 text-[#0D6EFD]' : 'bg-slate-100 text-slate-400'
              }`}>
                <AppWindow className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-base">شباك سولفان</h3>
                <p className="text-xs text-slate-500">تكلفة شباك السولفان</p>
              </div>
            </div>
            <label className="flex items-center gap-2 cursor-pointer select-none text-xs font-bold text-[#0D6EFD] bg-blue-50/80 hover:bg-blue-100/80 px-3 py-1.5 rounded-xl border border-blue-200/60 transition-colors">
              <input
                type="checkbox"
                checked={!!state.windowEnabled}
                onChange={(e) => updateField('windowEnabled', e.target.checked)}
                className="w-4 h-4 rounded text-[#0D6EFD] focus:ring-[#0D6EFD] cursor-pointer"
              />
              <span>تفعيل شباك السولفان</span>
            </label>
          </div>

          <div className={`space-y-3 transition-opacity ${state.windowEnabled ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">عدد الشباك</label>
              <input
                type="number"
                min="0"
                disabled={!state.windowEnabled}
                value={state.windowCount || ''}
                onChange={(e) => updateField('windowCount', parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-50 border border-[#D9E3F0] rounded-xl px-3.5 py-2.5 text-sm text-slate-800 font-bold focus:outline-none focus:border-[#0D6EFD] focus:bg-white transition-all disabled:bg-slate-100 disabled:text-slate-400"
                placeholder="1"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">سعر الشباك</label>
              <input
                type="number"
                min="0"
                disabled={!state.windowEnabled}
                value={state.windowPrice || ''}
                onChange={(e) => updateField('windowPrice', parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-50 border border-[#D9E3F0] rounded-xl px-3.5 py-2.5 text-sm text-slate-800 font-bold focus:outline-none focus:border-[#0D6EFD] focus:bg-white transition-all disabled:bg-slate-100 disabled:text-slate-400"
                placeholder="300"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">الإجمالي</label>
              <input
                type="number"
                min="0"
                disabled={!state.windowEnabled}
                value={state.windowTotal || ''}
                onChange={(e) => updateField('windowTotal', parseFloat(e.target.value) || 0)}
                className="w-full bg-blue-50/50 border border-[#0D6EFD]/30 rounded-xl px-3.5 py-2.5 text-sm text-[#0D6EFD] font-extrabold focus:outline-none focus:border-[#0D6EFD] focus:bg-white transition-all disabled:bg-slate-100 disabled:text-slate-400"
                placeholder="300"
              />
              <p className="text-[11px] text-blue-600 font-medium mt-1">
                (تم احتساب السعر تلقائياً)
              </p>
            </div>
          </div>
        </div>

        {/* 12. إضافات أخرى */}
        <div className={`bg-white border border-[#D9E3F0] rounded-2xl p-5 shadow-sm transition-all ${
          state.extraEnabled ? 'hover:border-[#0D6EFD]' : 'opacity-60 bg-slate-50/50'
        }`}>
          <div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b border-[#D9E3F0]">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold transition-colors ${
                state.extraEnabled ? 'bg-blue-50 text-[#0D6EFD]' : 'bg-slate-100 text-slate-400'
              }`}>
                <PlusCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-base">إضافات أخرى</h3>
                <p className="text-xs text-slate-500">خدمات وإضافات إضافية حسب الطلب</p>
              </div>
            </div>
            <label className="flex items-center gap-2 cursor-pointer select-none text-xs font-bold text-[#0D6EFD] bg-blue-50/80 hover:bg-blue-100/80 px-3 py-1.5 rounded-xl border border-blue-200/60 transition-colors">
              <input
                type="checkbox"
                checked={!!state.extraEnabled}
                onChange={(e) => updateField('extraEnabled', e.target.checked)}
                className="w-4 h-4 rounded text-[#0D6EFD] focus:ring-[#0D6EFD] cursor-pointer"
              />
              <span>تفعيل الإضافات</span>
            </label>
          </div>

          <div className={`space-y-3 transition-opacity ${state.extraEnabled ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">وصف الإضافة</label>
              <input
                type="text"
                disabled={!state.extraEnabled}
                value={state.extraDescription || ''}
                onChange={(e) => updateField('extraDescription', e.target.value)}
                className="w-full bg-slate-50 border border-[#D9E3F0] rounded-xl px-3.5 py-2.5 text-sm text-slate-800 font-bold focus:outline-none focus:border-[#0D6EFD] focus:bg-white transition-all disabled:bg-slate-100 disabled:text-slate-400"
                placeholder="نقل، تغليف، يوفي، فويل، شحن..."
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">السعر</label>
              <input
                type="number"
                min="0"
                step="any"
                disabled={!state.extraEnabled}
                value={state.extraPrice !== undefined && state.extraPrice !== null && state.extraPrice !== 0 ? state.extraPrice : ''}
                onChange={(e) => updateField('extraPrice', parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-50 border border-[#D9E3F0] rounded-xl px-3.5 py-2.5 text-sm text-slate-800 font-bold focus:outline-none focus:border-[#0D6EFD] focus:bg-white transition-all disabled:bg-slate-100 disabled:text-slate-400"
                placeholder="250"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">الإجمالي</label>
              <input
                type="number"
                min="0"
                readOnly
                disabled={!state.extraEnabled}
                value={state.extraTotal !== undefined && state.extraTotal !== null && state.extraTotal !== 0 ? state.extraTotal : (state.extraPrice || '')}
                className="w-full bg-blue-50/50 border border-[#0D6EFD]/30 rounded-xl px-3.5 py-2.5 text-sm text-[#0D6EFD] font-extrabold focus:outline-none focus:border-[#0D6EFD] focus:bg-white transition-all disabled:bg-slate-100 disabled:text-slate-400 cursor-not-allowed"
                placeholder="250"
              />
              <p className="text-[11px] text-blue-600 font-medium mt-1">
                (يساوي السعر المدخل)
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
