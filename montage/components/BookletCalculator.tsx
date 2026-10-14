import React, { useState, useCallback } from 'react';
import { Input } from './Input';
import { Select } from './Select';
import { Button } from './Button';
import { calculateBooklet } from '../services/bookletCalculatorService';
import type { BookletResult } from '../types';
import { BookletResultsDisplay } from './BookletResultsDisplay';

const BK2_PRESETS = {
    A4: {w:21,   h:29.7},
    A5: {w:14.8, h:21},
    A6: {w:10.5, h:14.8}
};

export const BookletCalculator: React.FC = () => {
    const [sheetW, setSheetW] = useState('48.7');
    const [sheetH, setSheetH] = useState('33');
    const [pageW, setPageW] = useState('14.8');
    const [pageH, setPageH] = useState('21');
    const [pages, setPages] = useState('');
    const [quantity, setQuantity] = useState('');
    const [cover, setCover] = useState('no');
    const [margin, setMargin] = useState('0');
    const [gutter, setGutter] = useState('0');
    
    const [result, setResult] = useState<BookletResult | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handlePresetChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const presetKey = e.target.value;
        const preset = BK2_PRESETS[presetKey as keyof typeof BK2_PRESETS];
        if (preset) {
            setPageW(String(preset.w));
            setPageH(String(preset.h));
        }
    };

    const handleCalculate = useCallback(() => {
        const numSheetW = parseFloat(sheetW);
        const numSheetH = parseFloat(sheetH);
        const numPageW = parseFloat(pageW);
        const numPageH = parseFloat(pageH);
        const numPages = parseInt(pages || '0', 10);
        const numQty = parseInt(quantity || '0', 10);
        const numMargin = parseFloat(margin || '0');
        const numGutter = parseFloat(gutter || '0');

        if (!(numSheetW > 0 && numSheetH > 0 && numPageW > 0 && numPageH > 0)) {
            setError('أدخل مقاسات صحيحة للشِّيت ولصفحة البوكليت.');
            setResult(null);
            return;
        }
        if (!(numPages > 0 && numPages % 4 === 0)) {
            setError('عدد الصفحات يجب أن يكون مضاعفًا للعدد 4.');
            setResult(null);
            return;
        }
        if (!(numQty > 0)) {
            setError('أدخل عدد النسخ.');
            setResult(null);
            return;
        }

        setError(null);
        const calcResult = calculateBooklet(
            numSheetW, numSheetH,
            numPageW, numPageH,
            numPages, numQty, numMargin,
            numGutter,
            cover === 'yes'
        );
        setResult(calcResult);

    }, [sheetW, sheetH, pageW, pageH, pages, quantity, cover, margin, gutter]);

    return (
        <section className="space-y-4">
            <h3 className="text-xl font-bold border-b border-gray-100 pb-2">مونتاج بوكليت | Booklet Montage</h3>
            <p className="text-gray-600 mt-1 mb-4 text-sm">
                القاعدة: صفحتان جنب بعض = سبريد واحد. صفحات/شِّيت = <span className="font-semibold bg-gray-800 text-white rounded-md px-2 py-0.5 text-xs">4 × عدد السبريد/وجه</span>.
            </p>

            <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-bold text-slate-600 mb-1">مقاس الشِّيت (سم) | Sheet Size</label>
                        <div className="grid grid-cols-2 gap-2">
                            <Input type="number" step="0.1" placeholder="عرض الشِّيت" value={sheetW} onChange={e => setSheetW(e.target.value)} />
                            <Input type="number" step="0.1" placeholder="طول الشِّيت" value={sheetH} onChange={e => setSheetH(e.target.value)} />
                        </div>
                    </div>
                     <div>
                        <label className="block text-sm font-bold text-slate-600 mb-1">مقاس الصفحة المسبق | Preset</label>
                        <Select onChange={handlePresetChange} defaultValue="A5">
                            <option value="">— اختر —</option>
                            <option value="A4">A4 (21 × 29.7)</option>
                            <option value="A5">A5 (14.8 × 21)</option>
                            <option value="A6">A6 (10.5 × 14.8)</option>
                        </Select>
                    </div>
                </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-bold text-slate-600 mb-1">مقاس الصفحة (سم) | Page Size</label>
                        <div className="grid grid-cols-2 gap-2">
                            <Input type="number" step="0.1" placeholder="عرض الصفحة" value={pageW} onChange={e => setPageW(e.target.value)} />
                            <Input type="number" step="0.1" placeholder="طول الصفحة" value={pageH} onChange={e => setPageH(e.target.value)} />
                        </div>
                         <p className="text-xs text-gray-500 mt-1">يمكنك تعديل القيم يدويًا بعد اختيار الـ Preset.</p>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-600 mb-1">عدد الصفحات (مضاعف 4) | Pages</label>
                        <Input type="number" min="4" step="4" placeholder="مثال: 24" value={pages} onChange={e => setPages(e.target.value)} />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-bold text-slate-600 mb-1">عدد النسخ | Total Quantity</label>
                        <Input type="number" min="1" placeholder="مثال: 1000" value={quantity} onChange={e => setQuantity(e.target.value)} />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-600 mb-1">غلاف 300 جم؟ | Has Cover?</label>
                        <Select value={cover} onChange={e => setCover(e.target.value)}>
                            <option value="yes">نعم (غلاف 4 صفحات 300–350جم)</option>
                            <option value="no">بدون غلاف</option>
                        </Select>
                    </div>
                </div>

                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-bold text-slate-600 mb-1">وزن الداخلي | Inner Wt.</label>
                        <Select value="150" disabled>
                            <option value="150">150–170جم</option>
                        </Select>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-600 mb-1">مارجن (سم) | Margin</label>
                        <Input type="number" step="0.1" value={margin} onChange={e => setMargin(e.target.value)} />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-600 mb-1">الفاصل (سم) | Gutter</label>
                        <Input type="number" step="0.1" value={gutter} onChange={e => setGutter(e.target.value)} />
                    </div>
                </div>
                 <hr className="border-gray-200 !mt-6"/>
                 <Button onClick={handleCalculate} fullWidth>احسب البوكليت</Button>
            </div>
            {error && <p className="text-red-600 mt-4 text-center">{error}</p>}
            {result && <BookletResultsDisplay result={result} />}
        </section>
    );
};