import React from 'react';
import type { CalculationResults } from '../types';

interface ResultsCardProps {
  results: CalculationResults;
  rollWidth: number;
  designWidth: number;
  overlap: number;
}

const ResultsCard: React.FC<ResultsCardProps> = ({
  results, rollWidth, designWidth, overlap
}) => {
  const formatNum = (n: number) => n.toLocaleString('en-US', { maximumFractionDigits: 2 });

  const ResultSmallCard = ({ label, labelEn, value, unit, color = "text-slate-900" }: { label: string, labelEn: string, value: string | number, unit?: string, color?: string }) => (
    <div className="bg-slate-100/50 p-3 rounded-xl border border-slate-200/50 flex flex-col justify-between relative min-h-[80px]">
        <div className="flex justify-between items-start w-full">
            <span className="text-[11px] font-bold text-slate-500">{label}</span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{labelEn}</span>
        </div>
        <div className="flex items-baseline justify-center gap-1">
            <span className={`text-xl font-black ${color}`}>{value}</span>
            {unit && <span className="text-[10px] font-bold text-slate-400">{unit}</span>}
        </div>
    </div>
  );

  // Drawing the visualization bar
  // Simple representation: design width vs roll width etc.
  const stripsCount = results.strips;
  const designPartWidth = designWidth / stripsCount;
  
  // Normalized widths for the bar chart (in percentages)
  const stripeWidth = (designPartWidth / rollWidth) * 100;
  const overlapWidth = (overlap / rollWidth) * 100;
  const wasteWidth = 100 - stripeWidth - (stripsCount > 1 ? overlapWidth : 0);

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xl shadow-slate-200/50 space-y-6 flex flex-col h-full">
      <div className="flex justify-between items-center border-b border-slate-100 pb-3">
        <h3 className="text-xl font-bold text-slate-800">النتائج | Results</h3>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <ResultSmallCard label="عدد الشرائح" labelEn="Strips" value={results.strips} />
        <ResultSmallCard label="إجمالي الطول (م)" labelEn="Total Length" value={formatNum(results.totalLength)} unit="م" />
        <ResultSmallCard label="مساحة التصميم (م٢)" labelEn="Design Area" value={formatNum(results.designArea)} unit="م٢" />
        
        <ResultSmallCard label="مساحة الطباعة (م٢)" labelEn="Print Area" value={formatNum(results.printedArea)} unit="م٢" />
        <ResultSmallCard label="مساحة الهدر (م٢)" labelEn="Waste Area" value={formatNum(results.wasteArea)} unit="م٢" />
        <ResultSmallCard label="نسبة الهدر" labelEn="Waste %" value={formatNum(results.wastePercent)} unit="%" color="text-red-500" />
        
        <ResultSmallCard label="السعر قبل التهدير" labelEn="Original Price" value={formatNum(results.priceBefore)} />
        <ResultSmallCard label="السعر بعد التهدير" labelEn="Total Price" value={formatNum(results.priceAfter)} color="text-slate-900" />
        <ResultSmallCard label="خسارة الهدر" labelEn="Waste Cost" value={formatNum(results.wasteCost)} color="text-red-600" />
      </div>

      {/* Visualizer Section */}
      <div className="mt-auto space-y-4 pt-6 bg-accent/5 rounded-2xl p-5 border border-accent/10">
        <h4 className="text-center text-sm font-bold text-slate-800 mb-4">الرسم البياني للشرائح + الأوفرلاب + التهدير</h4>
        
        <div className="relative h-20 w-full bg-slate-200 rounded-lg overflow-hidden flex items-stretch border-2 border-white shadow-inner">
            {/* Stripe */}
            <div className="bg-accent h-full border-r border-yellow-500 shadow-[inset_-8px_0_15px_rgba(0,0,0,0.1)] flex items-center justify-center" style={{ width: `${stripeWidth}%` }}>
            </div>
            
            {/* Overlap if more than 1 strip */}
            {stripsCount > 1 && (
                <div className="bg-slate-400 h-full border-r border-slate-500 animate-pulse" style={{ width: `${overlapWidth}%` }}>
                </div>
            )}
            
            {/* Waste */}
            <div className="bg-red-500 h-full flex items-center justify-center" style={{ width: `${Math.max(0, wasteWidth)}%` }}>
            </div>

            {/* Scale/Marker */}
            <div className="absolute top-0 right-0 h-full w-[1px] bg-red-800/30 border-r border-dashed border-red-900/50"></div>
            <div className="absolute top-0 left-0 h-full w-[1px] bg-accent/30 border-l border-dashed border-yellow-600/50"></div>
        </div>

        {/* Legend */}
        <div className="flex justify-center gap-6 text-[11px] font-bold text-slate-600">
            <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 bg-accent rounded-full"></span>
                <span>شريحة</span>
            </div>
            {stripsCount > 1 && (
                <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 bg-slate-400 rounded-full"></span>
                    <span>أوفرلاب</span>
                </div>
            )}
            <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 bg-red-500 rounded-full"></span>
                <span>تهدير</span>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsCard;
