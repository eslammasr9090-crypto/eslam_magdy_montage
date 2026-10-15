import React from 'react';
import { BoxPricingState } from '../types';
import {
  formatNumber,
  calculateGrandTotal,
} from '../utils/calculator';
import {
  Calculator,
  RotateCcw,
  TrendingUp,
} from 'lucide-react';

interface SummaryCardProps {
  state: BoxPricingState;
  onChangeState: (updatedState: BoxPricingState) => void;
  onCalculate: () => void;
  onReset: () => void;
  onPrint?: () => void;
  onExportPdf?: () => void;
  isPdfExporting?: boolean;
}

export const SummaryCard: React.FC<SummaryCardProps> = ({
  state,
  onChangeState,
  onCalculate,
  onReset,
  onPrint,
  onExportPdf,
  isPdfExporting = false,
}) => {
  const grandTotal = calculateGrandTotal(state);
  const profitMargin = Number(state.profitMargin) || 0;
  const profitValue = grandTotal * (profitMargin / 100);
  const finalPrice = grandTotal + profitValue;

  const handleMarginChange = (val: number) => {
    onChangeState({
      ...state,
      profitMargin: val,
    });
  };

  return (
    <div className="space-y-6 mt-8">
      
      {/* ملخص عرض السعر */}
      <div className="bg-white border-2 border-[#0D6EFD]/20 rounded-3xl p-6 sm:p-8 shadow-sm">
        
        {/* Header */}
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#D9E3F0]">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#0D6EFD] flex items-center justify-center font-bold shadow-inner">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-black text-[#0D6EFD]">ملخص عرض السعر</h3>
            <p className="text-xs text-slate-500 font-medium">
              حساب إجمالي التكلفة، هامش الربح، والتكلفة النهائية
            </p>
          </div>
        </div>

        {/* 4 Summary Cards Container */}
        <div className="space-y-4">
          
          {/* Top 3 Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            {/* 1. إجمالي التكلفة */}
            <div className="bg-slate-50/80 border border-[#D9E3F0] rounded-2xl p-5 text-center flex flex-col justify-between hover:border-[#0D6EFD]/40 transition-all">
              <span className="text-xs font-bold text-slate-500 block mb-2">
                إجمالي التكلفة
              </span>
              <div className="text-2xl sm:text-3xl font-black font-mono text-slate-800">
                {formatNumber(grandTotal)}
              </div>
            </div>

            {/* 2. هامش الربح (%) */}
            <div className="bg-slate-50/80 border border-[#D9E3F0] rounded-2xl p-5 text-center flex flex-col justify-between hover:border-[#0D6EFD]/40 transition-all">
              <span className="text-xs font-bold text-slate-500 block mb-2">
                هامش الربح (%)
              </span>
              <div className="flex items-center justify-center gap-1">
                <input
                  type="number"
                  min="0"
                  max="1000"
                  value={state.profitMargin ?? 25}
                  onChange={(e) => handleMarginChange(parseFloat(e.target.value) || 0)}
                  className="w-20 bg-white border border-[#D9E3F0] rounded-xl px-2 py-1 text-center font-black text-[#0D6EFD] text-2xl font-mono focus:outline-none focus:border-[#0D6EFD]"
                />
                <span className="text-xl font-black text-[#0D6EFD]">%</span>
              </div>
            </div>

            {/* 3. قيمة الربح */}
            <div className="bg-slate-50/80 border border-[#D9E3F0] rounded-2xl p-5 text-center flex flex-col justify-between hover:border-[#0D6EFD]/40 transition-all">
              <span className="text-xs font-bold text-slate-500 block mb-2">
                قيمة الربح
              </span>
              <div className="text-2xl sm:text-3xl font-black font-mono text-emerald-600">
                {formatNumber(profitValue)}
              </div>
            </div>

          </div>

          {/* 4. السعر النهائي (Larger featured card with blue background) */}
          <div className="bg-[#0D6EFD] text-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 text-center shadow-lg shadow-blue-500/20 border border-blue-400/30 relative overflow-hidden">
            <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
            <span className="text-sm sm:text-base font-extrabold text-blue-100 uppercase tracking-wider block mb-2">
              السعر النهائي
            </span>
            <div className="text-4xl sm:text-6xl font-black font-mono tracking-tight my-1">
              {formatNumber(finalPrice)}
            </div>
          </div>

        </div>

      </div>

      {/* Action Buttons Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 max-w-lg mx-auto w-full pt-2 no-print">
        {/* حساب (Primary Button - Larger, Blue) */}
        <button
          onClick={onCalculate}
          className="flex-1 w-full flex items-center justify-center gap-2.5 bg-[#0D6EFD] hover:bg-[#0b5ed7] text-white font-black py-4 px-8 rounded-2xl shadow-lg shadow-blue-500/25 border border-blue-400/30 transition-all text-base sm:text-lg cursor-pointer active:scale-[0.98]"
        >
          <Calculator className="w-6 h-6" />
          <span>حساب</span>
        </button>

        {/* إعادة تعيين */}
        <button
          onClick={onReset}
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-[#D9E3F0] font-bold py-4 px-6 rounded-2xl transition-all text-sm sm:text-base cursor-pointer active:scale-[0.98]"
        >
          <RotateCcw className="w-5 h-5 text-slate-500" />
          <span>إعادة تعيين</span>
        </button>
      </div>

    </div>
  );
};

