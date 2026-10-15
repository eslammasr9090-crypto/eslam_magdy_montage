import React, { useState, useEffect } from 'react';
import { PricingSettings } from '../types';
import { DEFAULT_PRICING_SETTINGS, getSavedSettings, saveSettings } from '../utils/calculator';
import { Settings, Save, RotateCcw, X, Check } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveSettings: (settings: PricingSettings) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  onSaveSettings,
}) => {
  const [settings, setSettings] = useState<PricingSettings>(DEFAULT_PRICING_SETTINGS);
  const [savedToast, setSavedToast] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSettings(getSavedSettings());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = <K extends keyof PricingSettings>(field: K, value: number) => {
    setSettings((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = () => {
    saveSettings(settings);
    onSaveSettings(settings);
    setSavedToast(true);
    setTimeout(() => {
      setSavedToast(false);
      onClose();
    }, 800);
  };

  const handleResetDefault = () => {
    if (window.confirm('هل تريد استعادة جميع الإعدادات الافتراضية للنظام؟')) {
      setSettings(DEFAULT_PRICING_SETTINGS);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div
        className="bg-white rounded-3xl shadow-2xl border border-[#D9E3F0] w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden text-right font-['Cairo',sans-serif]"
        dir="rtl"
      >
        {/* Modal Header */}
        <div className="px-6 py-5 bg-slate-50 border-b border-[#D9E3F0] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#0D6EFD] text-white flex items-center justify-center shadow-md shadow-blue-500/20">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900">إعدادات أسعار الحساب التلقائي</h2>
              <p className="text-xs text-slate-500 font-medium">
                تعديل الأسعار الافتراضية المستخدمة في الحسابات والتسعير الحقيقي
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-200/50 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body - Settings Grid */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* 1. تكلفة الورق وطباعة الورق والزنكات */}
          <div className="bg-slate-50 border border-[#D9E3F0] rounded-2xl p-5">
            <h3 className="font-bold text-[#0D6EFD] text-sm mb-3">تكلفة الورق وطباعته والزنكات (Paper, Printing & Plates)</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  سعر الشيت (افتراضي)
                </label>
                <input
                  type="number"
                  step="any"
                  value={settings.sheetPrice ?? 2}
                  onChange={(e) => handleChange('sheetPrice', parseFloat(e.target.value) || 0)}
                  className="w-full bg-white border border-[#D9E3F0] rounded-xl px-3 py-2 text-sm font-bold text-slate-800 focus:outline-none focus:border-[#0D6EFD]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  سعر طباعة الورق (افتراضي)
                </label>
                <input
                  type="number"
                  step="any"
                  value={settings.paperPrintingCost ?? 300}
                  onChange={(e) => handleChange('paperPrintingCost', parseFloat(e.target.value) || 0)}
                  className="w-full bg-white border border-[#D9E3F0] rounded-xl px-3 py-2 text-sm font-bold text-slate-800 focus:outline-none focus:border-[#0D6EFD]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  سعر الزنكة (افتراضي)
                </label>
                <input
                  type="number"
                  step="any"
                  value={settings.platePrice ?? 100}
                  onChange={(e) => handleChange('platePrice', parseFloat(e.target.value) || 0)}
                  className="w-full bg-white border border-[#D9E3F0] rounded-xl px-3 py-2 text-sm font-bold text-slate-800 focus:outline-none focus:border-[#0D6EFD]"
                />
              </div>
            </div>
          </div>

          {/* 2. السولفان */}
          <div className="bg-slate-50 border border-[#D9E3F0] rounded-2xl p-5">
            <h3 className="font-bold text-[#0D6EFD] text-sm mb-3">أسعار السولفان (Lamination)</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  تكلفة كل 1000 فرخ
                </label>
                <input
                  type="number"
                  value={settings.laminationPer1000}
                  onChange={(e) => handleChange('laminationPer1000', parseFloat(e.target.value) || 0)}
                  className="w-full bg-white border border-[#D9E3F0] rounded-xl px-3 py-2 text-sm font-bold text-slate-800 focus:outline-none focus:border-[#0D6EFD]"
                />
              </div>
            </div>
          </div>

          {/* 3. القالب والتكسير */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* القالب */}
            <div className="bg-slate-50 border border-[#D9E3F0] rounded-2xl p-5">
              <h3 className="font-bold text-[#0D6EFD] text-sm mb-3">أسعار القالب (Die)</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">مقاس ربع</label>
                  <input
                    type="number"
                    value={settings.dieQuarter}
                    onChange={(e) => handleChange('dieQuarter', parseFloat(e.target.value) || 0)}
                    className="w-full bg-white border border-[#D9E3F0] rounded-xl px-3 py-2 text-sm font-bold text-slate-800 focus:outline-none focus:border-[#0D6EFD]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">مقاس نصف</label>
                  <input
                    type="number"
                    value={settings.dieHalf}
                    onChange={(e) => handleChange('dieHalf', parseFloat(e.target.value) || 0)}
                    className="w-full bg-white border border-[#D9E3F0] rounded-xl px-3 py-2 text-sm font-bold text-slate-800 focus:outline-none focus:border-[#0D6EFD]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">مقاس متر</label>
                  <input
                    type="number"
                    value={settings.dieMeter}
                    onChange={(e) => handleChange('dieMeter', parseFloat(e.target.value) || 0)}
                    className="w-full bg-white border border-[#D9E3F0] rounded-xl px-3 py-2 text-sm font-bold text-slate-800 focus:outline-none focus:border-[#0D6EFD]"
                  />
                </div>
              </div>
            </div>

            {/* التكسير */}
            <div className="bg-slate-50 border border-[#D9E3F0] rounded-2xl p-5">
              <h3 className="font-bold text-[#0D6EFD] text-sm mb-3">أسعار التكسير (Creasing)</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">نوع دباب</label>
                  <input
                    type="number"
                    value={settings.creasingPlaten}
                    onChange={(e) => handleChange('creasingPlaten', parseFloat(e.target.value) || 0)}
                    className="w-full bg-white border border-[#D9E3F0] rounded-xl px-3 py-2 text-sm font-bold text-slate-800 focus:outline-none focus:border-[#0D6EFD]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">نوع سلندر</label>
                  <input
                    type="number"
                    value={settings.creasingCylinder}
                    onChange={(e) => handleChange('creasingCylinder', parseFloat(e.target.value) || 0)}
                    className="w-full bg-white border border-[#D9E3F0] rounded-xl px-3 py-2 text-sm font-bold text-slate-800 focus:outline-none focus:border-[#0D6EFD]"
                  />
                </div>
              </div>
            </div>

          </div>

          {/* 4. البصمة والتغرية والكفراج والتقفيل والشباك */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3">
            
            {/* البصمة */}
            <div className="bg-slate-50 border border-[#D9E3F0] rounded-2xl p-3.5">
              <h3 className="font-bold text-[#0D6EFD] text-[11px] mb-2">البصمة (Embossing)</h3>
              <div className="space-y-2">
                <div>
                  <label className="block text-[10px] font-semibold text-slate-700 mb-0.5">الكليشة</label>
                  <input
                    type="number"
                    value={settings.embossCliche}
                    onChange={(e) => handleChange('embossCliche', parseFloat(e.target.value) || 0)}
                    className="w-full bg-white border border-[#D9E3F0] rounded-xl px-2.5 py-1 text-xs font-bold text-slate-800 focus:outline-none focus:border-[#0D6EFD]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-slate-700 mb-0.5">الطباعة</label>
                  <input
                    type="number"
                    value={settings.embossPrint}
                    onChange={(e) => handleChange('embossPrint', parseFloat(e.target.value) || 0)}
                    className="w-full bg-white border border-[#D9E3F0] rounded-xl px-2.5 py-1 text-xs font-bold text-slate-800 focus:outline-none focus:border-[#0D6EFD]"
                  />
                </div>
              </div>
            </div>

            {/* تغرية اللسان */}
            <div className="bg-slate-50 border border-[#D9E3F0] rounded-2xl p-3.5">
              <h3 className="font-bold text-[#0D6EFD] text-[11px] mb-2">تغرية اللسان (Tongue)</h3>
              <div className="space-y-1.5">
                <div className="grid grid-cols-2 gap-1.5">
                  <div>
                    <label className="block text-[9px] font-semibold text-slate-700 mb-0.5">1 لسان</label>
                    <input
                      type="number"
                      value={settings.tongue1}
                      onChange={(e) => handleChange('tongue1', parseFloat(e.target.value) || 0)}
                      className="w-full bg-white border border-[#D9E3F0] rounded-xl px-2 py-0.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-[#0D6EFD]"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-semibold text-slate-700 mb-0.5">2 لسان</label>
                    <input
                      type="number"
                      value={settings.tongue2}
                      onChange={(e) => handleChange('tongue2', parseFloat(e.target.value) || 0)}
                      className="w-full bg-white border border-[#D9E3F0] rounded-xl px-2 py-0.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-[#0D6EFD]"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-1.5">
                  <div>
                    <label className="block text-[9px] font-semibold text-slate-700 mb-0.5">3 لسان</label>
                    <input
                      type="number"
                      value={settings.tongue3}
                      onChange={(e) => handleChange('tongue3', parseFloat(e.target.value) || 0)}
                      className="w-full bg-white border border-[#D9E3F0] rounded-xl px-2 py-0.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-[#0D6EFD]"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-semibold text-slate-700 mb-0.5">4 لسان</label>
                    <input
                      type="number"
                      value={settings.tongue4}
                      onChange={(e) => handleChange('tongue4', parseFloat(e.target.value) || 0)}
                      className="w-full bg-white border border-[#D9E3F0] rounded-xl px-2 py-0.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-[#0D6EFD]"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* تغرية الأكياس */}
            <div className="bg-slate-50 border border-[#D9E3F0] rounded-2xl p-3.5">
              <h3 className="font-bold text-[#0D6EFD] text-[11px] mb-2">تغرية الأكياس (Bags)</h3>
              <div>
                <label className="block text-[10px] font-semibold text-slate-700 mb-0.5">سعر ثابت</label>
                <input
                  type="number"
                  value={settings.bagFixed}
                  onChange={(e) => handleChange('bagFixed', parseFloat(e.target.value) || 0)}
                  className="w-full bg-white border border-[#D9E3F0] rounded-xl px-2.5 py-1 text-xs font-bold text-slate-800 focus:outline-none focus:border-[#0D6EFD]"
                />
              </div>
            </div>

            {/* الكفراج */}
            <div className="bg-slate-50 border border-[#D9E3F0] rounded-2xl p-3.5">
              <h3 className="font-bold text-[#0D6EFD] text-[11px] mb-2">الكفراج (Cover)</h3>
              <div className="grid grid-cols-2 gap-1.5">
                <div>
                  <label className="block text-[9px] font-semibold text-slate-700 mb-0.5">كليشة</label>
                  <input
                    type="number"
                    value={settings.coverCliche}
                    onChange={(e) => handleChange('coverCliche', parseFloat(e.target.value) || 0)}
                    className="w-full bg-white border border-[#D9E3F0] rounded-xl px-2 py-0.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-[#0D6EFD]"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-semibold text-slate-700 mb-0.5">طباعة</label>
                  <input
                    type="number"
                    value={settings.coverPrint}
                    onChange={(e) => handleChange('coverPrint', parseFloat(e.target.value) || 0)}
                    className="w-full bg-white border border-[#D9E3F0] rounded-xl px-2 py-0.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-[#0D6EFD]"
                  />
                </div>
              </div>
            </div>

            {/* التقفيل */}
            <div className="bg-slate-50 border border-[#D9E3F0] rounded-2xl p-3.5">
              <h3 className="font-bold text-[#0D6EFD] text-[11px] mb-2">التقفيل (Assembly)</h3>
              <div>
                <label className="block text-[10px] font-semibold text-slate-700 mb-0.5">لكل 1000</label>
                <input
                  type="number"
                  value={settings.assemblyPricePer1000}
                  onChange={(e) => handleChange('assemblyPricePer1000', parseFloat(e.target.value) || 0)}
                  className="w-full bg-white border border-[#D9E3F0] rounded-xl px-2.5 py-1 text-xs font-bold text-slate-800 focus:outline-none focus:border-[#0D6EFD]"
                />
              </div>
            </div>

            {/* شباك سولفان */}
            <div className="bg-slate-50 border border-[#D9E3F0] rounded-2xl p-3.5">
              <h3 className="font-bold text-[#0D6EFD] text-[11px] mb-2">شباك (Window)</h3>
              <div>
                <label className="block text-[10px] font-semibold text-slate-700 mb-0.5">سعر الشباك</label>
                <input
                  type="number"
                  value={settings.windowPrice}
                  onChange={(e) => handleChange('windowPrice', parseFloat(e.target.value) || 0)}
                  className="w-full bg-white border border-[#D9E3F0] rounded-xl px-2.5 py-1 text-xs font-bold text-slate-800 focus:outline-none focus:border-[#0D6EFD]"
                />
              </div>
            </div>

          </div>

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-[#D9E3F0] flex items-center justify-between gap-3">
          <button
            onClick={handleResetDefault}
            className="flex items-center gap-1.5 text-slate-600 hover:text-red-600 text-xs font-bold transition-all px-3 py-2 rounded-xl hover:bg-red-50 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>استعادة الافتراضي</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-[#D9E3F0] text-slate-700 font-bold text-xs sm:text-sm hover:bg-slate-200 transition-all cursor-pointer"
            >
              إلغاء
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0D6EFD] hover:bg-[#0b5ed7] text-white font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer"
            >
              {savedToast ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
              <span>{savedToast ? 'تم الحفظ!' : 'حفظ التغييرات'}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
