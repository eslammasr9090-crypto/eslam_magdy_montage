import React, { useState, useRef } from 'react';
import { BoxPricingState, PricingSettings } from './types';
import {
  getInitialStateWithSettings,
  calculateSheetsTotal,
  calculatePaperPrintingTotal,
  calculateLaminationTotal,
  calculateDieTotal,
  calculateCreasingTotal,
  calculateEmbossTotal,
  calculateTongueTotal,
  calculateBagTotal,
  calculateCoverTotal,
  calculateAssemblyTotal,
  calculateWindowTotal,
} from './utils/calculator';
import { generateQuotationPdf } from './utils/pdfExport';
import { Header } from './components/Header';
import { PricingForm } from './components/PricingForm';
import { SummaryCard } from './components/SummaryCard';
import { SettingsModal } from './components/SettingsModal';
import { PrintableQuotation } from './components/PrintableQuotation';
import { CheckCircle2, User, Mail } from 'lucide-react';

export default function App() {
  const [state, setState] = useState<BoxPricingState>(() => getInitialStateWithSettings());
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isPdfExporting, setIsPdfExporting] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const printableRef = useRef<HTMLDivElement>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleCalculate = () => {
    showToast('تم احتساب إجمالي التكلفة والربح بنجاح');
  };

  const handleReset = () => {
    if (window.confirm('هل أنت متأكد من إعادة تعيين كافة البيانات إلى القيم الافتراضية؟')) {
      setState(getInitialStateWithSettings());
      showToast('تمت إعادة التعيين بنجاح');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSaveSettings = (newSettings: PricingSettings) => {
    const sheets = state.requiredSheets || state.sheetsQuantity || 0;
    const updatedState: BoxPricingState = {
      ...state,
      sheetPrice: newSettings.sheetPrice,
      sheetsTotal: calculateSheetsTotal(sheets, newSettings.sheetPrice, newSettings),
      paperPrintingCost: newSettings.paperPrintingCost,
      paperPrintingTotal: calculatePaperPrintingTotal(newSettings.paperPrintingCost, newSettings),
      laminationTotal: calculateLaminationTotal(sheets, newSettings),
      dieTotal: calculateDieTotal(state.dieSize, newSettings),
      creasingTotal: calculateCreasingTotal(state.creasingType, newSettings),
      embossClicheCost: newSettings.embossCliche,
      embossTotal: calculateEmbossTotal(
        newSettings.embossCliche,
        state.embossQuantity > 0 ? newSettings.embossPrint : 0,
        newSettings
      ),
      tongueTotal: calculateTongueTotal(state.tongueOption, newSettings),
      bagTotal: state.bagQuantity > 0 ? calculateBagTotal(newSettings) : 0,
      coverClicheCost: newSettings.coverCliche,
      coverTotal: calculateCoverTotal(
        newSettings.coverCliche,
        state.coverQuantity > 0 ? newSettings.coverPrint : 0,
        newSettings
      ),
      assemblyPricePer1000: newSettings.assemblyPricePer1000,
      assemblyTotal: calculateAssemblyTotal(state.assemblyQuantity || state.orderQuantity || 0, newSettings.assemblyPricePer1000),
      windowPrice: newSettings.windowPrice,
      windowTotal: calculateWindowTotal(state.windowCount || 0, newSettings.windowPrice),
    };

    setState(updatedState);
    showToast('تم حفظ الأسعار الجديدة وتطبيقها بنجاح');
  };

  const handleExportPdf = async () => {
    setIsPdfExporting(true);
    showToast('جاري تصدير وتحميل ملف الـ PDF...');

    const el = document.getElementById('quotation-printable-area');
    if (el) {
      el.classList.remove('print-only');
      el.style.position = 'fixed';
      el.style.left = '-9999px';
      el.style.top = '0px';
      el.style.display = 'block';

      const fileName = `عرض_سعر_بوكسات_${new Date().toISOString().split('T')[0]}`;
      const success = await generateQuotationPdf('quotation-printable-area', fileName);

      el.style.display = '';
      el.style.position = '';
      el.style.left = '';
      el.style.top = '';
      el.classList.add('print-only');

      if (success) {
        showToast('تم تصدير ملف PDF بنجاح');
      } else {
        showToast('يمكنك استخدام زر الطباعة للتصدير إلى PDF بوضوح.');
      }
    }
    setIsPdfExporting(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-['Cairo',sans-serif] selection:bg-[#0D6EFD] selection:text-white pb-12" dir="rtl">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="no-print fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-slate-700 animate-fadeIn">
          <div className="w-6 h-6 rounded-full bg-blue-500/20 text-[#0D6EFD] flex items-center justify-center">
            <CheckCircle2 className="w-4 h-4 text-blue-400" />
          </div>
          <span className="text-xs sm:text-sm font-bold">{toastMessage}</span>
        </div>
      )}

      {/* Top Header */}
      <Header
        onCalculate={handleCalculate}
        onReset={handleReset}
        onPrint={handlePrint}
        onExportPdf={handleExportPdf}
        onOpenSettings={() => setIsSettingsOpen(true)}
        isPdfExporting={isPdfExporting}
      />

      {/* Main Content Area */}
      <main className="no-print flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* App Title directly at the top of content */}
        <div className="mb-8 border-b border-[#D9E3F0] pb-5">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
            حاسبة تسعير البوكسات والعلب
          </h2>
          <p className="text-sm text-slate-500 font-medium mt-1">
            أدخل كمية الطلب وعدد الشيتات والخيارات لمختلف الخدمات للاحتساب التلقائي المباشر
          </p>
        </div>

        {/* Pricing Form (Quantity, Sheets & 9 Services) */}
        <PricingForm
          state={state}
          onChange={(updatedState) => setState(updatedState)}
        />

        {/* Bottom Summary Card & Action Buttons */}
        <SummaryCard
          state={state}
          onChangeState={(updatedState) => setState(updatedState)}
          onCalculate={handleCalculate}
          onReset={handleReset}
          onPrint={handlePrint}
          onExportPdf={handleExportPdf}
          isPdfExporting={isPdfExporting}
        />

        {/* Footer Section (Screen View) */}
        <footer className="mt-12 pt-6 border-t border-[#D9E3F0] text-center text-xs text-slate-500">
          <div className="flex items-center justify-center gap-6 flex-wrap font-semibold">
            <div className="flex items-center gap-1.5 text-slate-700">
              <User className="w-4 h-4 text-[#0D6EFD]" />
              <span className="text-slate-500 font-normal">Prepared By:</span>
              <span className="font-bold text-slate-900">Eslam Magdy</span>
            </div>
            <span className="text-slate-300">•</span>
            <div className="flex items-center gap-1.5 text-slate-700 dir-ltr">
              <Mail className="w-4 h-4 text-[#0D6EFD]" />
              <span className="text-slate-500 font-normal">Email:</span>
              <a href="mailto:eslammagdy027@gmail.com" className="text-[#0D6EFD] hover:underline font-mono font-bold">
                eslammagdy027@gmail.com
              </a>
            </div>
          </div>
          <p className="text-[11px] text-slate-400 font-medium mt-2">
            جميع الحقوق محفوظة © {new Date().getFullYear()} - حاسبة تسعير البوكسات والعلب
          </p>
        </footer>

      </main>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onSaveSettings={handleSaveSettings}
      />

      {/* Hidden Printable Quotation */}
      <PrintableQuotation
        state={state}
        containerRef={printableRef}
      />

    </div>
  );
}
