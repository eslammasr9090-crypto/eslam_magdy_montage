import React from 'react';
import { BoxPricingState } from '../types';
import { calculateGrandTotal, formatNumber } from '../utils/calculator';
import { Package, User, Mail } from 'lucide-react';

interface PrintableQuotationProps {
  state: BoxPricingState;
  containerRef?: React.RefObject<HTMLDivElement | null>;
}

export const PrintableQuotation: React.FC<PrintableQuotationProps> = ({ state, containerRef }) => {
  const grandTotal = calculateGrandTotal(state);
  const profitMargin = Number(state.profitMargin) || 0;
  const profitValue = grandTotal * (profitMargin / 100);
  const finalPrice = grandTotal + profitValue;

  const items = [
    { id: 1, name: 'تكلفة الورق', details: `عدد الشيتات: ${formatNumber(state.sheetsQuantity)} - سعر الشيت: ${formatNumber(state.sheetPrice ?? 2)}`, total: state.sheetsTotal },
    { id: 2, name: 'طباعة الورق', details: `سعر الطباعة: ${formatNumber(state.paperPrintingCost ?? 300)}`, total: state.paperPrintingTotal ?? state.paperPrintingCost ?? 300 },
    { id: 3, name: 'الزنكات', details: `عدد الزنكات: ${formatNumber(state.platesQuantity)} - سعر الزنكة: ${formatNumber(state.platePrice ?? 100)}`, total: state.platesTotal },
    { id: 4, name: 'السولفان', details: `${formatNumber(state.laminationQuantity)} فرخ`, total: state.laminationTotal },
    { id: 5, name: 'الدايكت / القالب', details: state.dieSize, total: state.dieTotal },
    { id: 6, name: 'التكسير', details: state.creasingType, total: state.creasingTotal },
    { id: 7, name: 'البصمة', details: state.embossEnabled ? `كليشة: ${formatNumber(state.embossClicheCost)} - طباعة: ${formatNumber(state.embossQuantity)}` : 'غير مفعّلة', total: state.embossEnabled ? state.embossTotal : 0 },
    { id: 8, name: 'تغرية اللسان', details: state.tongueOption, total: state.tongueTotal },
    { id: 9, name: 'تغرية الأكياس', details: state.bagEnabled ? formatNumber(state.bagQuantity) : 'غير مفعّلة', total: state.bagEnabled ? state.bagTotal : 0 },
    { id: 10, name: 'الكفراج', details: state.coverEnabled ? `كليشة: ${formatNumber(state.coverClicheCost)} - طباعة: ${formatNumber(state.coverQuantity)}` : 'غير مفعّل', total: state.coverEnabled ? state.coverTotal : 0 },
    { id: 11, name: 'التقفيل', details: `الكمية: ${formatNumber(state.assemblyQuantity)} - سعر/1000: ${formatNumber(state.assemblyPricePer1000)}`, total: state.assemblyTotal },
    { id: 12, name: 'شباك سولفان', details: state.windowEnabled ? `عدد الشباك: ${formatNumber(state.windowCount)} - سعر الشباك: ${formatNumber(state.windowPrice)}` : 'غير مفعّل', total: state.windowEnabled ? state.windowTotal : 0 },
    { id: 13, name: 'إضافات أخرى', details: state.extraEnabled ? (state.extraDescription ? `الوصف: ${state.extraDescription}` : 'إضافات أخرى') : 'غير مفعّلة', total: state.extraEnabled ? (state.extraTotal ?? state.extraPrice ?? 0) : 0 },
  ];

  return (
    <div className="print-only">
      <div
        ref={containerRef as any}
        id="quotation-printable-area"
        className="print-container bg-white text-slate-800 p-8 max-w-[210mm] mx-auto text-right font-['Cairo',sans-serif]"
        dir="rtl"
      >
        {/* Printable Header */}
        <div className="flex items-center justify-between border-b-2 border-[#0D6EFD] pb-5 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-[#0D6EFD] text-white rounded-xl flex items-center justify-center font-black text-2xl">
              <Package className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900">عرض سعر طباعة وتصنيع علب</h1>
              <p className="text-xs text-slate-500 font-semibold">وثيقة عرض سعر معتمدة للبوكسات والعلب</p>
            </div>
          </div>
          <div className="text-left text-xs text-slate-500 font-bold space-y-0.5">
            <div>التاريخ: {new Date().toLocaleDateString('ar-EG')}</div>
            <div>رقم الطلب: #{Math.floor(100000 + Math.random() * 900000)}</div>
          </div>
        </div>

        {/* 1. بيانات الكمية والورق */}
        <div className="mb-6">
          <h2 className="text-sm font-black text-[#0D6EFD] mb-2 uppercase tracking-wide">
            بيانات الكمية والورق
          </h2>
          <div className="bg-slate-50 border border-[#D9E3F0] rounded-xl p-3 grid grid-cols-5 gap-2 text-xs text-center">
            <div>
              <span className="text-slate-500 block font-bold mb-0.5">مقاس الشيت</span>
              <span className="font-extrabold text-slate-900 text-xs">
                {state.paperSize === 'مقاس مخصص'
                  ? `${state.customWidth || 0}×${state.customHeight || 0}`
                  : `${state.paperSize || '70×100'}`}
              </span>
            </div>
            <div>
              <span className="text-slate-500 block font-bold mb-0.5">عدد العلب في الشيت</span>
              <span className="font-extrabold text-slate-900 text-xs">{state.boxesPerSheet || 0}</span>
            </div>
            <div>
              <span className="text-slate-500 block font-bold mb-0.5">كمية العلب</span>
              <span className="font-extrabold text-slate-900 text-xs">{formatNumber(state.orderQuantity || 0)}</span>
            </div>
            <div>
              <span className="text-slate-500 block font-bold mb-0.5">عدد الشيتات</span>
              <span className="font-extrabold text-[#0D6EFD] text-xs">{formatNumber(state.requiredSheets || 0)}</span>
            </div>
            <div>
              <span className="text-slate-500 block font-bold mb-0.5">عدد المعاون</span>
              <span className="font-extrabold text-[#0D6EFD] text-xs">{formatNumber(state.bundlesQuantity || 0)}</span>
            </div>
          </div>
        </div>

        {/* 2. تفاصيل الخدمات والتكاليف */}
        <div className="mb-6">
          <h2 className="text-sm font-black text-[#0D6EFD] mb-2 uppercase tracking-wide">
            تفاصيل الخدمات
          </h2>
          <table className="w-full border-collapse border border-[#D9E3F0] text-xs">
            <thead>
              <tr className="bg-[#0D6EFD] text-white font-bold text-right">
                <th className="border border-[#0D6EFD] p-2.5 w-10 text-center">#</th>
                <th className="border border-[#0D6EFD] p-2.5">البند / الخدمة</th>
                <th className="border border-[#0D6EFD] p-2.5 text-center">التفاصيل</th>
                <th className="border border-[#0D6EFD] p-2.5 text-left w-28">الإجمالي</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-b border-[#D9E3F0]">
                  <td className="border border-[#D9E3F0] p-2 text-center font-bold">{item.id}</td>
                  <td className="border border-[#D9E3F0] p-2 font-bold text-slate-800">{item.name}</td>
                  <td className="border border-[#D9E3F0] p-2 text-center text-slate-600">{item.details}</td>
                  <td className="border border-[#D9E3F0] p-2 text-left font-bold font-mono text-slate-900">{formatNumber(item.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 3. ملخص عرض السعر والربح */}
        <div className="mb-6 bg-slate-50 border border-[#D9E3F0] rounded-xl p-4">
          <h2 className="text-sm font-black text-[#0D6EFD] mb-3 uppercase tracking-wide">
            ملخص عرض السعر
          </h2>
          <div className="grid grid-cols-4 gap-3 text-center text-xs">
            <div className="bg-white border border-[#D9E3F0] p-3 rounded-lg">
              <span className="text-slate-500 font-bold block mb-1">إجمالي التكلفة</span>
              <span className="text-base font-black font-mono text-slate-800">{formatNumber(grandTotal)}</span>
            </div>
            <div className="bg-white border border-[#D9E3F0] p-3 rounded-lg">
              <span className="text-slate-500 font-bold block mb-1">هامش الربح</span>
              <span className="text-base font-black font-mono text-[#0D6EFD]">{profitMargin}%</span>
            </div>
            <div className="bg-white border border-[#D9E3F0] p-3 rounded-lg">
              <span className="text-slate-500 font-bold block mb-1">قيمة الربح</span>
              <span className="text-base font-black font-mono text-emerald-600">{formatNumber(profitValue)}</span>
            </div>
            <div className="bg-[#0D6EFD] text-white p-3 rounded-lg">
              <span className="text-blue-100 font-bold block mb-1">السعر النهائي</span>
              <span className="text-lg font-black font-mono">{formatNumber(finalPrice)}</span>
            </div>
          </div>
        </div>

        {/* Footer Section */}
        <div className="mt-8 pt-5 border-t border-[#D9E3F0] text-center text-xs text-slate-600 space-y-2">
          <div className="flex items-center justify-center gap-6 flex-wrap">
            <div className="flex items-center gap-1.5 font-bold text-slate-800">
              <User className="w-3.5 h-3.5 text-[#0D6EFD]" />
              <span className="text-slate-500 font-medium">Prepared By:</span>
              <span>Eslam Magdy</span>
            </div>
            <span className="text-slate-300">•</span>
            <div className="flex items-center gap-1.5 font-bold text-slate-800 dir-ltr">
              <Mail className="w-3.5 h-3.5 text-[#0D6EFD]" />
              <span className="text-slate-500 font-medium">Email:</span>
              <span className="text-[#0D6EFD] font-mono">eslammagdy027@gmail.com</span>
            </div>
          </div>
          <div className="text-[10px] text-slate-400 font-medium pt-1">
            هذا التقرير تم إصداره آلياً عبر نظام حاسبة تسعير البوكسات • العرض ساري لمدة 7 أيام من تاريخ الإصدار
          </div>
        </div>

      </div>
    </div>
  );
};
