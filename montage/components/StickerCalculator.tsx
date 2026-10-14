import React, { useState, useEffect, useCallback } from 'react';
import { BANNER_ROLLS, STICKER_ROLLS } from '../constants';
import type { MaterialType, CalculationResults } from '../types';
import InputCard from './InputCard';
import ResultsCard from './ResultsCard';

export const StickerCalculator: React.FC = () => {
  const [material, setMaterial] = useState<MaterialType>('sticker');
  const [rollWidth, setRollWidth] = useState<number>(STICKER_ROLLS[0]);
  const [designWidth, setDesignWidth] = useState<number>(450);
  const [designHeight, setDesignHeight] = useState<number>(250);
  const [overlap, setOverlap] = useState<number>(2);
  const [pricePerSqm, setPricePerSqm] = useState<number>(25);
  const [quantity, setQuantity] = useState<number>(1);

  const [results, setResults] = useState<CalculationResults>({
    strips: 0,
    totalLength: 0,
    designArea: 0,
    printedArea: 0,
    wasteArea: 0,
    wastePercent: 0,
    priceBefore: 0,
    priceAfter: 0,
    wasteCost: 0,
  });

  const calculate = useCallback(() => {
    const roll = rollWidth;
    const dw = designWidth;
    const dh = designHeight;
    const ov = overlap;
    const price = pricePerSqm;
    const qty = quantity >= 1 ? quantity : 1;

    if (!roll || !dw || !dh || isNaN(roll) || isNaN(dw) || isNaN(dh)) {
        return;
    }
    
    let strips;
    if (dw <= roll) {
      strips = 1;
    } else {
      const effectiveWidth = roll - ov;
      if (effectiveWidth <= 0) {
        strips = Math.ceil(dw / roll);
      } else {
        strips = 1 + Math.ceil((dw - roll) / effectiveWidth);
      }
    }

    const singleTotalLength = (strips * dh) / 100;
    const singleDesignArea = (dw * dh) / 10000;
    const singlePrintedArea = (strips * roll * dh) / 10000;
    const singleWasteArea = singlePrintedArea - singleDesignArea;
    const wastePercent = singlePrintedArea > 0 ? (singleWasteArea / singlePrintedArea) * 100 : 0;
    const singlePriceBefore = singleDesignArea * price;
    const singlePriceAfter = singlePrintedArea * price;
    const singleWasteCost = Math.max(0, singlePriceAfter - singlePriceBefore);

    setResults({
      strips,
      totalLength: singleTotalLength * qty,
      designArea: singleDesignArea * qty,
      printedArea: singlePrintedArea * qty,
      wasteArea: singleWasteArea * qty,
      wastePercent,
      priceBefore: singlePriceBefore * qty,
      priceAfter: singlePriceAfter * qty,
      wasteCost: singleWasteCost * qty
    });
  }, [rollWidth, designWidth, designHeight, overlap, pricePerSqm, quantity]);

  useEffect(() => {
    calculate();
  }, [calculate]);

  useEffect(() => {
    const newRolls = material === 'sticker' ? STICKER_ROLLS : BANNER_ROLLS;
    if (!newRolls.includes(rollWidth)) {
        setRollWidth(newRolls[0]);
    }
  }, [material, rollWidth]);

  return (
    <div className="flex justify-center p-0 font-sans text-slate-900" dir="rtl">
      <div className="w-full bg-white rounded-xl p-0 shadow-none border-none">
        <header className="text-center mb-6">
          <h2 className="text-2xl font-bold m-0 text-slate-900">حاسبة الاستيكرات والبنرات</h2>
          <p className="text-slate-500 mt-1">أداة لحساب الشرائح، الهدر، والأوفرلاب – Sticker & Banner Calculator</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Inputs column on the right (first in RTL) */}
          <div className="lg:col-span-2">
             <InputCard 
                material={material}
                setMaterial={setMaterial}
                rollWidth={rollWidth}
                setRollWidth={setRollWidth}
                designWidth={designWidth}
                setDesignWidth={setDesignWidth}
                designHeight={designHeight}
                setDesignHeight={setDesignHeight}
                overlap={overlap}
                setOverlap={setOverlap}
                pricePerSqm={pricePerSqm}
                setPricePerSqm={setPricePerSqm}
                quantity={quantity}
                setQuantity={setQuantity}
             />
          </div>
          {/* Results column on the left (second in RTL) */}
          <div className="lg:col-span-3">
             <ResultsCard 
                results={results}
                rollWidth={rollWidth}
                designWidth={designWidth}
                overlap={overlap}
             />
          </div>
        </div>
        
        <div className="text-center mt-8 text-sm text-gray-400">
          Designed by <strong className="font-bold">Eslam Magdy</strong>
          <br />
          <a
            href="https://www.behance.net/eslammagdy58"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            www.behance.net/eslammagdy58
          </a>
        </div>

      </div>
    </div>
  );
};
