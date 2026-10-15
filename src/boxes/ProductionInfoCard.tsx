import React from 'react';
import { BoxPricingState } from '../types';
import {
  calculateRequiredSheets,
  calculateBundlesQuantity,
  calculateSheetsTotal,
  calculateLaminationTotal,
  calculateAssemblyTotal,
  getSavedSettings,
  formatNumber,
} from '../utils/calculator';
import { Factory, Maximize2, Hash, Layers, Box, Package } from 'lucide-react';

interface ProductionInfoCardProps {
  state: BoxPricingState;
  onChange: (updatedState: BoxPricingState) => void;
}

const PAPER_SIZE_OPTIONS = [
  '35×50',
  '50×70',
  '69×100',
  '70×100',
  '72×102',
  '75×105',
  '100×140',
  'مقاس مخصص',
];

export const ProductionInfoCard: React.FC<ProductionInfoCardProps> = ({ state, onChange }) => {
  const updateProductionData = (
    paperSize: string,
    boxesPerSheet: number,
    orderQuantity: number,
    customWidth?: number,
    customHeight?: number
  ) => {
    const settings = getSavedSettings();
    const sheets = calculateRequiredSheets(orderQuantity, boxesPerSheet);
    const bundles = calculateBundlesQuantity(sheets);

    const sheetPrice = state.sheetPrice ?? settings.sheetPrice ?? 2;
    const sheetsTotal = calculateSheetsTotal(sheets, sheetPrice, settings);
    const laminationTotal = calculateLaminationTotal(sheets, settings);

    const assemblyPrice = state.assemblyPricePer1000 || settings.assemblyPricePer1000;
    const assemblyTotal = calculateAssemblyTotal(orderQuantity, assemblyPrice);

    onChange({
      ...state,
      paperSize,
      boxesPerSheet,
      orderQuantity,
      customWidth,
      customHeight,
      requiredSheets: sheets,
      bundlesQuantity: bundles,
      sheetsQuantity: sheets,
      sheetsTotal,
      laminationQuantity: sheets,
      laminationTotal,
      assemblyQuantity: orderQuantity,
      assemblyTotal,
    });
  };

  const paperSizeDisplay =
    state.paperSize === 'مقاس مخصص'
      ? `${state.customWidth || 0} × ${state.customHeight || 0} سم`
      : `${state.paperSize || '70×100'} سم`;

  return (
    <div className="bg-white border-2 border-[#0D6EFD]/20 rounded-3xl p-6 sm:p-8 shadow-sm hover:border-[#0D6EFD]/40 transition-all mb-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#D9E3F0]">
        <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#0D6EFD] flex items-center justify-center font-bold shadow-inner">
          <Factory className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-xl font-black text-[#0D6EFD]">بيانات الكمية والورق</h3>
          <p className="text-xs text-slate-500 font-medium">
            حدد مقاس الشيت وعدد العلب في الشيت وكمية العلب لحساب عدد الشيتات والمعاون تلقائياً
          </p>
        </div>
      </div>

      {/* Inputs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
        {/* 1. مقاس الشيت */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-700 flex items-center gap-1.5">
            <Maximize2 className="w-4 h-4 text-[#0D6EFD]" />
            <span>مقاس الشيت</span>
          </label>
          <select
            value={state.paperSize || '70×100'}
            onChange={(e) =>
              updateProductionData(
                e.target.value,
                state.boxesPerSheet || 1,
                state.orderQuantity || 0,
                state.customWidth,
                state.customHeight
              )
            }
            className="w-full bg-slate-50 border border-[#D9E3F0] rounded-xl px-3 py-2.5 text-sm text-slate-800 font-bold focus:outline-none focus:border-[#0D6EFD] focus:bg-white transition-all cursor-pointer"
          >
            {PAPER_SIZE_OPTIONS.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>

        {/* 2. عدد العلب في الشيت */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-700 flex items-center gap-1.5">
            <Box className="w-4 h-4 text-[#0D6EFD]" />
            <span>عدد العلب في الشيت</span>
          </label>
          <input
            type="number"
            min="1"
            value={state.boxesPerSheet || ''}
            onChange={(e) =>
              updateProductionData(
                state.paperSize || '70×100',
                parseFloat(e.target.value) || 0,
                state.orderQuantity || 0,
                state.customWidth,
                state.customHeight
              )
            }
            className="w-full bg-slate-50 border border-[#D9E3F0] rounded-xl px-3.5 py-2.5 text-sm text-slate-800 font-bold focus:outline-none focus:border-[#0D6EFD] focus:bg-white transition-all"
            placeholder="مثال: 2"
          />
        </div>

        {/* 3. كمية العلب المطلوبة */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-700 flex items-center gap-1.5">
            <Hash className="w-4 h-4 text-[#0D6EFD]" />
            <span>كمية العلب المطلوبة</span>
          </label>
          <input
            type="number"
            min="1"
            value={state.orderQuantity || ''}
            onChange={(e) =>
              updateProductionData(
                state.paperSize || '70×100',
                state.boxesPerSheet || 1,
                parseFloat(e.target.value) || 0,
                state.customWidth,
                state.customHeight
              )
            }
            className="w-full bg-slate-50 border border-[#D9E3F0] rounded-xl px-3.5 py-2.5 text-sm text-slate-800 font-bold focus:outline-none focus:border-[#0D6EFD] focus:bg-white transition-all"
            placeholder="مثال: 1000"
          />
        </div>

        {/* 4. عدد الشيتات المطلوبة (Read Only) */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-700 flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-[#0D6EFD]" />
            <span>عدد الشيتات المطلوبة</span>
          </label>
          <div className="w-full bg-blue-50/70 border border-[#0D6EFD]/30 rounded-xl px-3.5 py-2.5 text-sm font-black text-[#0D6EFD] flex items-center justify-between">
            <span>{formatNumber(state.requiredSheets || 0)}</span>
            <span className="text-xs font-normal text-blue-600">شيت</span>
          </div>
        </div>

        {/* 5. عدد المعاون (Read Only) */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-700 flex items-center gap-1.5">
            <Package className="w-4 h-4 text-[#0D6EFD]" />
            <span>عدد المعاون</span>
          </label>
          <div className="w-full bg-blue-50/70 border border-[#0D6EFD]/30 rounded-xl px-3.5 py-2.5 text-sm font-black text-[#0D6EFD] flex items-center justify-between">
            <span>{formatNumber(state.bundlesQuantity || 0)}</span>
            <span className="text-xs font-normal text-blue-600">معون</span>
          </div>
        </div>
      </div>

      {/* Custom dimensions if مقاس مخصص */}
      {state.paperSize === 'مقاس مخصص' && (
        <div className="mb-6 grid grid-cols-2 gap-4 bg-blue-50/50 p-4 rounded-2xl border border-blue-100">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">عرض الشيت (سم)</label>
            <input
              type="number"
              value={state.customWidth || ''}
              onChange={(e) =>
                updateProductionData(
                  'مقاس مخصص',
                  state.boxesPerSheet || 1,
                  state.orderQuantity || 0,
                  parseFloat(e.target.value) || 0,
                  state.customHeight
                )
              }
              className="w-full bg-white border border-[#D9E3F0] rounded-xl px-3 py-2 text-sm text-slate-800 font-bold focus:outline-none focus:border-[#0D6EFD]"
              placeholder="العرض"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">ارتفاع الشيت (سم)</label>
            <input
              type="number"
              value={state.customHeight || ''}
              onChange={(e) =>
                updateProductionData(
                  'مقاس مخصص',
                  state.boxesPerSheet || 1,
                  state.orderQuantity || 0,
                  state.customWidth,
                  parseFloat(e.target.value) || 0
                )
              }
              className="w-full bg-white border border-[#D9E3F0] rounded-xl px-3 py-2 text-sm text-slate-800 font-bold focus:outline-none focus:border-[#0D6EFD]"
              placeholder="الارتفاع"
            />
          </div>
        </div>
      )}

      {/* Summary Box Display */}
      <div className="bg-slate-50 border border-[#D9E3F0] rounded-2xl p-4 sm:p-5">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 text-center text-xs">
          <div className="bg-white border border-[#D9E3F0] p-3 rounded-xl">
            <span className="text-slate-500 font-bold block mb-1">مقاس الشيت</span>
            <span className="text-slate-900 font-black text-sm">{paperSizeDisplay}</span>
          </div>

          <div className="bg-white border border-[#D9E3F0] p-3 rounded-xl">
            <span className="text-slate-500 font-bold block mb-1">عدد العلب في الشيت</span>
            <span className="text-slate-900 font-black text-sm">{state.boxesPerSheet || 0}</span>
          </div>

          <div className="bg-white border border-[#D9E3F0] p-3 rounded-xl">
            <span className="text-slate-500 font-bold block mb-1">كمية العلب</span>
            <span className="text-slate-900 font-black text-sm">{formatNumber(state.orderQuantity || 0)}</span>
          </div>

          <div className="bg-white border border-[#D9E3F0] p-3 rounded-xl">
            <span className="text-slate-500 font-bold block mb-1">عدد الشيتات</span>
            <span className="text-[#0D6EFD] font-black text-sm">{formatNumber(state.requiredSheets || 0)}</span>
          </div>

          <div className="bg-white border border-[#D9E3F0] p-3 rounded-xl col-span-2 sm:col-span-1">
            <span className="text-slate-500 font-bold block mb-1">عدد المعاون</span>
            <span className="text-[#0D6EFD] font-black text-sm">{formatNumber(state.bundlesQuantity || 0)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
