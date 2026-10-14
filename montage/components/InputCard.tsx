import React from 'react';
import type { MaterialType } from '../types';
import { BANNER_ROLLS, STICKER_ROLLS } from '../constants';

interface InputCardProps {
  material: MaterialType;
  setMaterial: (m: MaterialType) => void;
  rollWidth: number;
  setRollWidth: (w: number) => void;
  designWidth: number;
  setDesignWidth: (w: number) => void;
  designHeight: number;
  setDesignHeight: (h: number) => void;
  overlap: number;
  setOverlap: (o: number) => void;
  pricePerSqm: number;
  setPricePerSqm: (p: number) => void;
  quantity: number;
  setQuantity: (q: number) => void;
}

const InputCard: React.FC<InputCardProps> = ({
  material, setMaterial,
  rollWidth, setRollWidth,
  designWidth, setDesignWidth,
  designHeight, setDesignHeight,
  overlap, setOverlap,
  pricePerSqm, setPricePerSqm,
  quantity, setQuantity
}) => {
  const rolls = material === 'sticker' ? STICKER_ROLLS : BANNER_ROLLS;

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xl shadow-slate-200/50 space-y-6">
      <div className="flex justify-between items-center border-b border-slate-100 pb-3">
        <h3 className="text-xl font-bold text-slate-800">المدخلات | Inputs</h3>
      </div>
      
      <div className="space-y-2">
        <label className="block text-sm font-bold text-slate-600 text-right">نوع المادة | Material</label>
        <div className="grid grid-cols-2 gap-2 p-1.5 bg-slate-100 rounded-2xl">
          <button
            onClick={() => setMaterial('sticker')}
            className={`py-2 px-4 rounded-xl font-bold transition-all ${material === 'sticker' ? 'bg-accent text-slate-900 shadow-md' : 'text-slate-500 hover:bg-slate-200'}`}
          >
            استيكرات
          </button>
          <button
            onClick={() => setMaterial('banner')}
            className={`py-2 px-4 rounded-xl font-bold transition-all ${material === 'banner' ? 'bg-accent text-slate-900 shadow-md' : 'text-slate-500 hover:bg-slate-200'}`}
          >
            بنرات
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-bold text-slate-600 mb-2">عرض الرول (سم) | Roll Width</label>
          <select 
            value={rollWidth}
            onChange={(e) => setRollWidth(Number(e.target.value))}
            className="w-full p-4 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-accent/20 focus:border-accent outline-none transition-all text-xl font-bold text-slate-900"
          >
            {rolls.map(r => (
              <option key={r} value={r}>{r} سم</option>
            ))}
          </select>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-600 mb-2">عرض التصميم (سم) | Design Width</label>
            <input 
              type="number"
              value={designWidth}
              onChange={(e) => setDesignWidth(Number(e.target.value))}
              placeholder="0"
              className="w-full p-4 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-accent/20 focus:border-accent outline-none transition-all text-xl font-bold text-slate-900 text-center"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-600 mb-2">ارتفاع التصميم (سم) | Design Height</label>
            <input 
              type="number"
              value={designHeight}
              onChange={(e) => setDesignHeight(Number(e.target.value))}
              placeholder="0"
              className="w-full p-4 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-accent/20 focus:border-accent outline-none transition-all text-xl font-bold text-slate-900 text-center"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-bold text-slate-600 mb-2">الأوفرلاب (سم) | Overlap</label>
            <input 
              type="number"
              value={overlap}
              onChange={(e) => setOverlap(Number(e.target.value))}
              className="w-full p-4 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-accent/20 focus:border-accent outline-none transition-all text-xl font-bold text-slate-900 text-center"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-600 mb-2">سعر المتر المربع | Price per m²</label>
            <input 
              type="number"
              value={pricePerSqm}
              onChange={(e) => setPricePerSqm(Number(e.target.value))}
              className="w-full p-4 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-accent/20 focus:border-accent outline-none transition-all text-xl font-bold text-slate-900 text-center"
            />
          </div>
        </div>

        <div>
           <label className="block text-sm font-bold text-slate-600 mb-2">الكمية | Quantity</label>
           <input 
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="w-full p-4 bg-accent/10 border border-accent/20 rounded-2xl focus:ring-4 focus:ring-accent/20 focus:border-accent outline-none transition-all text-2xl font-black text-slate-900 text-center"
          />
        </div>
      </div>
    </div>
  );
};

export default InputCard;
