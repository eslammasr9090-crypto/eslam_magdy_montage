import React, { useState, useCallback } from 'react';
import { SheetVisualizer } from './components/SheetVisualizer';
import { ResultsDisplay } from './components/ResultsDisplay';
import { SheetInput } from './components/SheetInput';
import { ItemInput } from './components/ItemInput';
import { QuantityInput } from './components/QuantityInput';
import { Button } from './components/Button';
import { BookletCalculator } from './components/BookletCalculator';
import { StickerCalculator } from './components/StickerCalculator';
import type { FitResult, OrientationPreference } from './types';
import { bestFit } from './services/calculatorService';
import { MAOUN_TYPES } from './constants';
import { Search } from 'lucide-react';

const FIXED_SHEET = { w: 48.7, h: 33 };

const App: React.FC = () => {
  const [zoom, setZoom] = useState<number>(100);
  // State for Standard Calculator
  const [sheetWidth, setSheetWidth] = useState<string>(String(FIXED_SHEET.w));
  const [sheetHeight, setSheetHeight] = useState<string>(String(FIXED_SHEET.h));
  const [isSheetLocked, setIsSheetLocked] = useState<boolean>(true);
  const [itemWidth, setItemWidth] = useState<string>('');
  const [itemHeight, setItemHeight] = useState<string>('');
  const [margin, setMargin] = useState<string>('0');
  const [gutter, setGutter] = useState<string>('0');
  const [orientationPreference, setOrientationPreference] = useState<OrientationPreference>('auto');
  const [quantity, setQuantity] = useState<string>('');
  const [maounType, setMaounType] = useState<string>('');
  const [result, setResult] = useState<FitResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // State for active tab
  const [activeTab, setActiveTab] = useState<'standard' | 'booklet' | 'sticker'>('standard');

  const handleCalculate = useCallback(() => {
    const pW = parseFloat(sheetWidth);
    const pH = parseFloat(sheetHeight);
    const iW = parseFloat(itemWidth);
    const iH = parseFloat(itemHeight);
    const q = parseInt(quantity || '0', 10);
    const m = parseFloat(margin || '0');
    const g = parseFloat(gutter || '0');

    if (!(pW > 0 && pH > 0 && iW > 0 && iH > 0)) {
      setError('أدخل المقاسات بشكل صحيح.');
      setResult(null);
      return;
    }

    setError(null);
    const best = bestFit(pW, pH, iW, iH, m, g, orientationPreference);
    const perSheet = best.total;
    const sheetsNeeded = perSheet ? Math.ceil(q / perSheet) : 0;
    const bigSheets = Math.ceil(sheetsNeeded / 4);

    let maounInfo = null;
    if (maounType && MAOUN_TYPES[maounType]) {
        const mset = MAOUN_TYPES[maounType];
        const maounCount = Math.ceil(sheetsNeeded / mset.smallPerMaoun);
        maounInfo = {
            name: mset.name,
            count: maounCount
        };
    }

    setResult({
        best,
        quantity: q,
        sheetsNeeded,
        bigSheets,
        maounInfo
    });
  }, [sheetWidth, sheetHeight, itemWidth, itemHeight, quantity, margin, gutter, maounType, orientationPreference]);

  const TabButton: React.FC<{isActive: boolean; onClick: () => void; children: React.ReactNode;}> = ({ isActive, onClick, children }) => (
    <button
      onClick={onClick}
      className={`px-4 py-2 text-sm sm:text-base font-bold rounded-lg transition-colors w-full sm:w-auto ${
        isActive
          ? 'bg-accent text-gray-900 shadow-sm'
          : 'bg-white hover:bg-gray-200 text-gray-700 border border-gray-300'
      }`}
    >
      {children}
    </button>
  );

  return (
    <div className="bg-gray-100 min-h-screen text-gray-900 font-sans overflow-x-hidden overflow-y-auto" dir="rtl">
      <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
        <header className="mb-6 text-center">
          <h1 className="text-2xl sm:text-3xl font-bold">مونتاج ديچيتال واستيكر — Digital & Sticker Montage</h1>
          <p className="text-gray-600 mt-1 max-w-3xl mx-auto">أداة احترافية لحساب مقاسات الطباعة، مونتاج البوكليت، وتوزيع الاستيكرات بجميع أشكالها.</p>
        </header>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-6">
          <div className="flex flex-col sm:flex-row justify-center gap-2 w-full sm:w-auto">
            <TabButton isActive={activeTab === 'standard'} onClick={() => setActiveTab('standard')}>
              حاسب القياسات | Standard
            </TabButton>
            <TabButton isActive={activeTab === 'booklet'} onClick={() => setActiveTab('booklet')}>
              مونتاج بوكليت | Booklet
            </TabButton>
            <TabButton isActive={activeTab === 'sticker'} onClick={() => setActiveTab('sticker')}>
              حاسب الاستيكرات | Sticker
            </TabButton>
          </div>

          <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-full border border-gray-200 shadow-sm">
             <Search size={18} className="text-blue-500" />
             <span className="text-sm font-bold text-slate-600 whitespace-nowrap">تكبير/تصغير:</span>
             <input 
                type="range" 
                min="50" 
                max="150" 
                value={zoom} 
                onChange={(e) => setZoom(Number(e.target.value))}
                className="w-24 sm:w-32 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-accent"
             />
             <span className="text-xs font-mono font-bold text-slate-400 w-8">{zoom}%</span>
          </div>
        </div>

        <main style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top center', transition: 'transform 0.1s ease-out' }}>
          {activeTab === 'standard' && (
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 sm:p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                <div className="flex flex-col gap-6">
                  <SheetInput
                    width={sheetWidth}
                    setWidth={setSheetWidth}
                    height={sheetHeight}
                    setHeight={setSheetHeight}
                    isLocked={isSheetLocked}
                    setIsLocked={setIsSheetLocked}
                    fixedSheet={FIXED_SHEET}
                  />
                  <hr className="border-gray-200"/>
                  <ItemInput
                    width={itemWidth}
                    setWidth={setItemWidth}
                    height={itemHeight}
                    setHeight={setItemHeight}
                    margin={margin}
                    setMargin={setMargin}
                    gutter={gutter}
                    setGutter={setGutter}
                    orientation={orientationPreference}
                    setOrientation={setOrientationPreference}
                  />
                  <hr className="border-gray-200"/>
                  <QuantityInput
                    quantity={quantity}
                    setQuantity={setQuantity}
                    maounType={maounType}
                    setMaounType={setMaounType}
                  />
                  <hr className="border-gray-200"/>
                  <div>
                    <Button onClick={handleCalculate} fullWidth>
                      احسب
                    </Button>
                    {error && <p className="text-red-600 mt-4 text-center">{error}</p>}
                    {result && <ResultsDisplay result={result} />}
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold mb-4 border-b border-gray-100 pb-2">معاينة الشِّيت | Sheet Preview <span className="text-sm font-normal bg-gray-800 text-white rounded-md px-2 py-0.5">{sheetWidth || 0} × {sheetHeight || 0}</span></h3>
                  <SheetVisualizer 
                    sheetWidth={parseFloat(sheetWidth)}
                    sheetHeight={parseFloat(sheetHeight)}
                    itemWidth={parseFloat(itemWidth)}
                    itemHeight={parseFloat(itemHeight)}
                    margin={parseFloat(margin)}
                    gutter={parseFloat(gutter)}
                    fitResult={result?.best}
                  />
                  <p className="text-xs text-gray-500 mt-2 text-center">المعاينة نسبية للحجم لكنها دقيقة في النِّسب والاتجاه.</p>
                </div>
              </div>
            </div>
          )}
          {activeTab === 'booklet' && (
             <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 sm:p-6">
                <BookletCalculator />
             </div>
          )}
          {activeTab === 'sticker' && (
             <StickerCalculator />
          )}
          <footer className="text-center mt-8 text-sm text-gray-500">
              Designed &amp; Developed by <b>Eslam Magdy</b> — 📧 <a href="mailto:Eslammagdy027@gmail.com" className="hover:underline">Eslammagdy027@gmail.com</a>
          </footer>
        </main>
      </div>
    </div>
  );
};

export default App;