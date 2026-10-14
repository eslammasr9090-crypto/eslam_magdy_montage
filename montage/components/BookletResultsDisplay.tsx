import React from 'react';
import type { BookletResult } from '../types';

interface BookletResultsDisplayProps {
  result: BookletResult;
}

export const BookletResultsDisplay: React.FC<BookletResultsDisplayProps> = ({ result }) => {
  const formatNumber = (num: number) => num.toLocaleString('en-US');

  return (
    <div className="mt-6 text-base space-y-4 p-4 bg-accent/5 rounded-lg border border-accent/20">
      
      <section>
        <h4 className="text-lg font-bold text-gray-800 border-b border-gray-100 pb-1 mb-2">نتيجة المونتاج | Montage Result</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
          <p>أفضل اتجاه | Orientation: <b className="font-bold text-gray-800">{result.fit.orient === 'Portrait' ? 'طولي' : 'عرضي'}</b></p>
          <p>سبريد/وجه | Spreads/Face: <b className="font-bold text-gray-800">{formatNumber(result.spreadsPerFace)}</b></p>
          <p>صفحات/شِّيت | Pages/Sheet: <b className="font-bold text-gray-800">{formatNumber(result.pagesPerSheet)}</b></p>
        </div>
      </section>

      <section>
        <h4 className="text-lg font-bold text-gray-800 border-b border-gray-100 pb-1 mb-2">تقسيم الصفحات | Page Split</h4>
        <p className="text-sm" dangerouslySetInnerHTML={{ __html: result.info }} />
      </section>
      
      <section>
        <h4 className="text-lg font-bold text-gray-800 border-b border-gray-100 pb-1 mb-2">الشِّيت المطلوبة | Sheets Needed</h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm">
          <p>غلاف | Cover: <b className="font-bold text-gray-800">{formatNumber(result.coverSheets)}</b></p>
          <p>داخلي | Inner: <b className="font-bold text-gray-800">{formatNumber(result.innerSheets)}</b></p>
          <p>الإجمالي | Total: <b className="font-bold text-gray-800">{formatNumber(result.totalSheets)}</b></p>
        </div>
      </section>

      <section>
        <h4 className="text-lg font-bold text-gray-800 border-b border-gray-100 pb-1 mb-2">أوراق ١٠٠×٧٠ | 100x70 Sheets</h4>
        <p className="text-xs text-gray-500 mb-2">كل ورقة ١٠٠×٧٠ تحتوي على <b className="font-bold text-gray-800">{formatNumber(result.perBig)}</b> شيت</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm">
          <p>غلاف | Cover: <b className="font-bold text-gray-800">{formatNumber(result.coverBigSheets)}</b></p>
          <p>داخلي | Inner: <b className="font-bold text-gray-800">{formatNumber(result.innerBigSheets)}</b></p>
          <p>الإجمالي | Total: <b className="font-bold text-gray-800">{formatNumber(result.totalBigSheets)}</b></p>
        </div>
      </section>

      <section>
        <h4 className="text-lg font-bold text-gray-800 border-b border-gray-100 pb-1 mb-2">المَعُون | Maoun</h4>
        <div className="text-sm space-y-1">
          {result.coverMaoun > 0 && <p>غلاف (٣٠٠–٣٥٠جم): <b>{formatNumber(result.coverMaoun)}</b> معون</p>}
          <p>داخلي (١٠٠–١٧٠جم): <b className="font-bold text-gray-800">{formatNumber(result.innerMaoun)}</b> معون</p>
          <p className="font-bold pt-1 border-t border-accent/10">الإجمالي | Total: {formatNumber(result.totalMaoun)} معون</p>
        </div>
      </section>
      
      <p className="text-xs text-gray-500 pt-2 border-t border-gray-200 mt-4 leading-relaxed">
        ملحوظة: الهوامش/البلِيد قد تقلل الاستفادة. يمكنك تعديل القيم يدويًا بعد اختيار الـ Preset.
      </p>
    </div>
  );
};