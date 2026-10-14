import React from 'react';
import type { FitResult } from '../types';

interface ResultsDisplayProps {
  result: FitResult;
}

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ result }) => {
  const { best, quantity, sheetsNeeded, bigSheets, maounInfo } = result;

  const formatNumber = (num: number) => num.toLocaleString('en-US');
  const formatDecimal = (val: string) => {
      const num = parseFloat(val);
      return isNaN(num) ? '0' : num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  return (
    <div className="mt-6 text-base space-y-2 p-4 bg-accent/5 rounded-lg border border-accent/20">
      <p>أفضل اتجاه | Best Orientation: <b className="font-bold text-gray-800">{best.orient === 'Portrait' ? 'طولي' : 'عرضي'}</b></p>
      <p>القطع لكل شِّيت | Pcs/Sheet: <b className="font-bold text-gray-800">{formatNumber(best.total)}</b> ({formatNumber(best.cols)} عمود × {formatNumber(best.rows)} صف)</p>
      <p>الكمية المطلوبة | Total Qty: <b className="font-bold text-gray-800">{formatNumber(quantity)}</b> → الشِّيت المطلوبة | Sheets: <b className="font-bold text-gray-800">{formatNumber(sheetsNeeded)}</b></p>
      {maounInfo && (
        <>
            <p>أوراق ١٠٠×٧٠ المطلوبة | Big Sheets: <b className="font-bold text-gray-800">{formatNumber(bigSheets)}</b></p>
            <p>عدد المعون | Maoun Count ({maounInfo.name}): <b className="font-bold text-gray-800">{formatNumber(maounInfo.count)}</b> معون</p>
        </>
      )}
      <p className="text-sm text-gray-500 pt-2 border-t border-gray-200 mt-2">المتبقي | Waste: عرض: <b>{formatDecimal(best.leftW)}</b> سم، طول: <b>{formatDecimal(best.leftH)}</b> سم.</p>
    </div>
  );
};