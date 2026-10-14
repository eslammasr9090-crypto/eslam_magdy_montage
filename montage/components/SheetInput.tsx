import React from 'react';
import { Input } from './Input';
import { Button } from './Button';
import { Select } from './Select';
import { SHEET_PRESETS } from '../constants';

interface SheetInputProps {
  width: string;
  setWidth: (value: string) => void;
  height: string;
  setHeight: (value: string) => void;
  isLocked: boolean;
  setIsLocked: (value: boolean) => void;
  fixedSheet: { w: number; h: number };
}

export const SheetInput: React.FC<SheetInputProps> = ({
  width,
  setWidth,
  height,
  setHeight,
  isLocked,
  setIsLocked,
  fixedSheet,
}) => {
  const handleReset = () => {
    setWidth(String(fixedSheet.w));
    setHeight(String(fixedSheet.h));
    setIsLocked(true);
  };

  const handlePresetChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const preset = SHEET_PRESETS[e.target.value];
    if (preset) {
      setWidth(String(preset.w));
      setHeight(String(preset.h));
      // Automatically unlock if user chooses a preset that isn't the default locked one
      if (preset.w !== fixedSheet.w || preset.h !== fixedSheet.h) {
          setIsLocked(false);
      }
    }
  };
  
  return (
    <section className="space-y-4">
      <h3 className="text-xl font-bold border-b border-gray-100 pb-2">مواصفات الشِّيت | Sheet Specs</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
        <div>
          <label htmlFor="sheetPreset" className="block text-sm font-bold text-slate-600 mb-1">مقاس الشِّيت المسبق | Preset</label>
          <Select id="sheetPreset" onChange={handlePresetChange} defaultValue="SRA3">
            <optgroup label="Digital Printing (ديجيتال)">
              <option value="SRA3">ديجيتال (33 × 48.7)</option>
              <option value="SRA3_32_45">ديجيتال (32 × 45)</option>
              <option value="SRA3_LONG">ديجيتال طويل (33 × 70)</option>
              <option value="SRA3_X_LONG">ديجيتال سوبر طويل (33 × 100)</option>
              <option value="SRA3_BANNER">ديجيتال بانر (33 × 120)</option>
            </optgroup>
            <optgroup label="Offset / Industrial (أوفست)">
              <option value="FULL_SHEET_100_70">فرخ كامل (70 × 100)</option>
              <option value="HALF_SHEET_70_50">نص فرخ (50 × 70)</option>
              <option value="QUARTER_SHEET_50_35">ربع فرخ (35 × 50)</option>
              <option value="OFFSET_57_82">مقاس ٥٧ × ٨٢</option>
              <option value="OFFSET_60_90">مقاس ٦٠ × ٩٠</option>
            </optgroup>
            <optgroup label="ISO Standards (مقاسات عالمية)">
              <option value="A0">A0</option>
              <option value="A1">A1</option>
              <option value="A2">A2</option>
              <option value="A3">A3</option>
              <option value="A4">A4</option>
              <option value="B0">B0</option>
              <option value="B1">B1</option>
              <option value="B2">B2</option>
              <option value="B3">B3</option>
            </optgroup>
          </Select>
        </div>
        <div className="flex items-end pb-0.5">
           <Button onClick={() => setIsLocked(!isLocked)} fullWidth>
            {isLocked ? `🔒 مقفول` : '🔓 مفتوح للتعديل'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
        <div>
          <label htmlFor="paperWidth" className="block text-sm font-bold text-slate-600 mb-1">عرض الشِّيت (سم) | Width</label>
          <Input id="paperWidth" type="number" step="0.1" value={width} onChange={(e) => setWidth(e.target.value)} disabled={isLocked} />
        </div>
        <div>
          <label htmlFor="paperHeight" className="block text-sm font-bold text-slate-600 mb-1">طول الشِّيت (سم) | Height</label>
          <Input id="paperHeight" type="number" step="0.1" value={height} onChange={(e) => setHeight(e.target.value)} disabled={isLocked} />
        </div>
      </div>
      
      <div className="flex mt-3">
        <Button onClick={handleReset} variant="secondary">
          إعادة تعيين للوضع الافتراضي
        </Button>
      </div>
       <p className="text-xs text-gray-500 mt-2">مقاس الشِّيت الافتراضي هو 33 × 48.7 سم (SRA3).</p>
    </section>
  );
};
