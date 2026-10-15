import React from 'react';
import { Package, Calculator, RotateCcw, Settings } from 'lucide-react';

interface HeaderProps {
  onCalculate: () => void;
  onReset: () => void;
  onPrint?: () => void;
  onExportPdf?: () => void;
  onOpenSettings: () => void;
  isPdfExporting?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onCalculate,
  onReset,
  onPrint,
  onExportPdf,
  onOpenSettings,
  isPdfExporting = false,
}) => {
  return (
    <header className="no-print bg-white border-b border-[#D9E3F0] sticky top-0 z-30 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        
        {/* Brand Title */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#0D6EFD] text-white flex items-center justify-center shadow-md shadow-blue-500/20">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              حاسبة تسعير البوكسات
            </h1>
            <p className="text-xs text-slate-500 font-medium hidden sm:block">
              نظام تقدير وتكاليف طباعة وتصنيع العلب والأكياس
            </p>
          </div>
        </div>

        {/* Header Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* حساب */}
          <button
            onClick={onCalculate}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-[#0D6EFD] hover:bg-[#0b5ed7] text-white text-xs sm:text-sm font-bold transition-all shadow-md shadow-blue-500/20 cursor-pointer"
          >
            <Calculator className="w-4 h-4" />
            <span>حساب</span>
          </button>

          {/* الإعدادات */}
          <button
            onClick={onOpenSettings}
            className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 border border-[#D9E3F0] text-xs sm:text-sm font-bold transition-all cursor-pointer"
            title="الإعدادات"
          >
            <Settings className="w-4 h-4 text-slate-600" />
            <span className="hidden sm:inline">الإعدادات</span>
          </button>

          {/* إعادة تعيين */}
          <button
            onClick={onReset}
            className="p-2.5 rounded-xl bg-slate-100 hover:bg-red-50 text-slate-500 hover:text-red-600 border border-[#D9E3F0] hover:border-red-200 transition-all cursor-pointer"
            title="إعادة تعيين"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

      </div>
    </header>
  );
};
