import React from 'react';
import { Input } from './Input';
import { Select } from './Select';
import { ITEM_PRESETS } from '../constants';
import type { OrientationPreference } from '../types';

interface ItemInputProps {
  width: string;
  setWidth: (value: string) => void;
  height: string;
  setHeight: (value: string) => void;
  margin: string;
  setMargin: (value: string) => void;
  gutter: string;
  setGutter: (value: string) => void;
  orientation: OrientationPreference;
  setOrientation: (value: OrientationPreference) => void;
}

export const ItemInput: React.FC<ItemInputProps> = ({
  width,
  setWidth,
  height,
  setHeight,
  margin,
  setMargin,
  gutter,
  setGutter,
  orientation,
  setOrientation,
}) => {
  const handlePresetChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const preset = ITEM_PRESETS[e.target.value];
    if (preset) {
      setWidth(String(preset.w));
      setHeight(String(preset.h));
    }
  };

  const toggleClasses = (active: boolean) => 
    `flex-1 py-2 text-sm font-bold rounded-lg border transition-all ${
      active 
        ? 'bg-accent border-accent text-gray-900 shadow-sm' 
        : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'
    }`;

  return (
    <section className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-3 border-b border-gray-100 pb-2">
        <h3 className="text-xl font-bold">مقاس القطعة | Item Size</h3>
        <div className="flex w-full sm:w-auto p-1 bg-gray-100 rounded-xl gap-1">
          <button 
            type="button"
            onClick={() => setOrientation('auto')} 
            className={toggleClasses(orientation === 'auto')}
          >
            تلقائي | Auto
          </button>
          <button 
            type="button"
            onClick={() => setOrientation('portrait')} 
            className={toggleClasses(orientation === 'portrait')}
          >
            طولي | Port.
          </button>
          <button 
            type="button"
            onClick={() => setOrientation('landscape')} 
            className={toggleClasses(orientation === 'landscape')}
          >
            عرضي | Land.
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
        <div>
          <label htmlFor="itemPreset" className="block text-sm font-bold text-slate-600 mb-1">Preset سريع | Quick Preset</label>
          <Select id="itemPreset" onChange={handlePresetChange} defaultValue="">
            <option value="">— اختر مقاسًا —</option>
            <option value="A5">A5 (21 × 14.8)</option>
            <option value="A4">A4 (29.7 × 21)</option>
            <option value="A6">A6 (14.8 × 10.5)</option>
            <option value="DL">DL (21 × 9.9)</option>
            <option value="BC">Business Card (9 × 5)</option>
          </Select>
        </div>
        <div className="grid grid-cols-2 gap-2">
            <div>
                <label htmlFor="margin" className="block text-sm font-bold text-slate-600 mb-1">الهامش | Margin</label>
                <Input id="margin" type="number" step="0.1" value={margin} onChange={(e) => setMargin(e.target.value)} placeholder="سم" />
            </div>
            <div>
                <label htmlFor="gutter" className="block text-sm font-bold text-slate-600 mb-1">الفاصل | Gutter</label>
                <Input id="gutter" type="number" step="0.1" value={gutter} onChange={(e) => setGutter(e.target.value)} placeholder="سم" />
            </div>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
        <div>
          <label htmlFor="itemWidth" className="block text-sm font-bold text-slate-600 mb-1">عرض القطعة (سم) | Width</label>
          <Input id="itemWidth" type="number" step="0.1" placeholder="مثال: 21" value={width} onChange={(e) => setWidth(e.target.value)} />
        </div>
        <div>
          <label htmlFor="itemHeight" className="block text-sm font-bold text-slate-600 mb-1">طول القطعة (سم) | Height</label>
          <Input id="itemHeight" type="number" step="0.1" placeholder="مثال: 14.8" value={height} onChange={(e) => setHeight(e.target.value)} />
        </div>
      </div>
    </section>
  );
};