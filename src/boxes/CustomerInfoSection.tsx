import React from 'react';
import { CustomerQuoteInfo } from '../types';
import { User, Phone, Package, Hash, Calendar, Percent, ShieldAlert } from 'lucide-react';

interface CustomerInfoSectionProps {
  info: CustomerQuoteInfo;
  onChange: (updated: CustomerQuoteInfo) => void;
}

export const CustomerInfoSection: React.FC<CustomerInfoSectionProps> = ({ info, onChange }) => {
  const handleChange = (field: keyof CustomerQuoteInfo, value: any) => {
    onChange({
      ...info,
      [field]: value,
    });
  };

  return (
    <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 sm:p-6 shadow-xl backdrop-blur-sm mb-6">
      <div className="flex items-center justify-between border-b border-slate-700/80 pb-4 mb-5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <User className="w-4 h-4" />
          </div>
          <h2 className="text-lg font-bold text-white">بيانات العملاء والطلب</h2>
        </div>
        <span className="text-xs text-slate-400 bg-slate-900/60 px-3 py-1 rounded-full border border-slate-700">
          معلومات عرض السعر
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Quote Number */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
            <Hash className="w-3.5 h-3.5 text-blue-400" />
            رقم عرض السعر
          </label>
          <input
            type="text"
            value={info.quoteNumber}
            onChange={(e) => handleChange('quoteNumber', e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-mono"
            placeholder="Q-1001"
          />
        </div>

        {/* Client Name */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-blue-400" />
            اسم العميل / الشركة
          </label>
          <input
            type="text"
            value={info.clientName}
            onChange={(e) => handleChange('clientName', e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
            placeholder="شركة..."
          />
        </div>

        {/* Client Phone */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
            <Phone className="w-3.5 h-3.5 text-blue-400" />
            رقم الجوال
          </label>
          <input
            type="text"
            value={info.clientPhone}
            onChange={(e) => handleChange('clientPhone', e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-left font-mono"
            dir="ltr"
            placeholder="05xxxxxxx"
          />
        </div>

        {/* Quote Date */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-blue-400" />
            تاريخ العرض
          </label>
          <input
            type="date"
            value={info.quoteDate}
            onChange={(e) => handleChange('quoteDate', e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
          />
        </div>

        {/* Box Title */}
        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
            <Package className="w-3.5 h-3.5 text-indigo-400" />
            وصف المنتج / البوكس
          </label>
          <input
            type="text"
            value={info.boxName}
            onChange={(e) => handleChange('boxName', e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
            placeholder="علبة كرتون، بوكس هدايا، كيس ورقي..."
          />
        </div>

        {/* Box Total Quantity */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
            <Package className="w-3.5 h-3.5 text-emerald-400" />
            كمية البوكسات المطلوبة
          </label>
          <input
            type="number"
            min="1"
            value={info.boxQuantity || ''}
            onChange={(e) => handleChange('boxQuantity', parseFloat(e.target.value) || 0)}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white font-bold placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
            placeholder="1000"
          />
        </div>

        {/* Profit Margin % */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Percent className="w-3.5 h-3.5 text-amber-400" />
              نسبة هامش الربح (%)
            </span>
            <span className="text-[11px] text-amber-400 font-bold">{info.profitMarginPercent}%</span>
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min="0"
              max="200"
              value={info.profitMarginPercent || ''}
              onChange={(e) => handleChange('profitMarginPercent', parseFloat(e.target.value) || 0)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-amber-300 font-bold focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
              placeholder="20"
            />
          </div>
        </div>
      </div>

      {/* VAT Toggle & Notes */}
      <div className="mt-4 pt-4 border-t border-slate-700/60 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <label className="flex items-center gap-3 cursor-pointer bg-slate-900/60 px-4 py-2.5 rounded-xl border border-slate-700 hover:border-slate-600 transition-all select-none">
          <input
            type="checkbox"
            checked={info.includeVat}
            onChange={(e) => handleChange('includeVat', e.target.checked)}
            className="w-4 h-4 rounded text-blue-600 bg-slate-900 border-slate-700 focus:ring-blue-500 focus:ring-offset-slate-900"
          />
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-sky-400" />
            <span className="text-xs font-semibold text-slate-200">إضافة ضريبة القيمة المضافة (15% VAT)</span>
          </div>
        </label>

        <div className="flex-1 sm:max-w-md">
          <input
            type="text"
            value={info.notes}
            onChange={(e) => handleChange('notes', e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-slate-300 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-all"
            placeholder="ملاحظات وشروط العرض..."
          />
        </div>
      </div>
    </div>
  );
};
