import React from 'react';
import { SavedQuotation } from '../types';
import { formatCurrencySAR } from '../utils/calculator';
import { X, BookmarkCheck, Trash2, ExternalLink, Calendar, User, Package, FileText } from 'lucide-react';

interface SavedQuotesModalProps {
  isOpen: boolean;
  onClose: () => void;
  quotes: SavedQuotation[];
  onLoadQuote: (quote: SavedQuotation) => void;
  onDeleteQuote: (id: string) => void;
  onClearAll: () => void;
}

export const SavedQuotesModal: React.FC<SavedQuotesModalProps> = ({
  isOpen,
  onClose,
  quotes,
  onLoadQuote,
  onDeleteQuote,
  onClearAll,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in no-print">
      <div className="bg-slate-900 border border-slate-700/80 w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-800/80 border-b border-slate-700/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <BookmarkCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">سجل عروض الأسعار المحفوظة</h2>
              <p className="text-xs text-slate-400">العروض الاستعراضية والاستعادة السريعة</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {quotes.length === 0 ? (
            <div className="text-center py-12 text-slate-500 space-y-3">
              <FileText className="w-12 h-12 mx-auto text-slate-600 opacity-50" />
              <p className="text-sm font-semibold">لا يوجد عروض أسعار محفوظة حالياً.</p>
              <p className="text-xs">قم بملء حاسبة التسعير واضغط على "حفظ العرض" لحفظه في هذا السجل.</p>
            </div>
          ) : (
            quotes.map((q) => (
              <div
                key={q.id}
                className="bg-slate-800/60 border border-slate-700/80 hover:border-slate-600 rounded-2xl p-4 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-mono px-2.5 py-0.5 rounded-md font-bold">
                      {q.state.info.quoteNumber || 'Q-1001'}
                    </span>
                    <h3 className="font-bold text-white text-base">
                      {q.state.info.boxName || 'بوكس ورقي'}
                    </h3>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-slate-400 flex-wrap">
                    <span className="flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-slate-500" />
                      {q.state.info.clientName || 'بدون اسم'}
                    </span>
                    <span className="flex items-center gap-1">
                      <Package className="w-3.5 h-3.5 text-slate-500" />
                      {q.state.info.boxQuantity} حبة
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-500" />
                      {new Date(q.createdAt).toLocaleDateString('ar-SA')}
                    </span>
                  </div>
                </div>

                {/* Price and Actions */}
                <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto border-t sm:border-t-0 border-slate-700/60 pt-3 sm:pt-0">
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block">الإجمالي الكلي</span>
                    <span className="text-base font-black text-emerald-400 font-mono">
                      {formatCurrencySAR(q.breakdown.grandTotal)} <span className="text-xs">ر.س</span>
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        onLoadQuote(q);
                        onClose();
                      }}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-all shadow-md shadow-blue-900/40"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>استعادة</span>
                    </button>

                    <button
                      onClick={() => onDeleteQuote(q.id)}
                      className="p-2 rounded-xl bg-slate-900 hover:bg-red-500/20 text-slate-400 hover:text-red-400 border border-slate-700 hover:border-red-500/30 transition-all"
                      title="حذف"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal Footer */}
        {quotes.length > 0 && (
          <div className="px-6 py-4 bg-slate-800/80 border-t border-slate-700/80 flex items-center justify-between">
            <span className="text-xs text-slate-400">
              عدد العروض المحفوظة: <strong className="text-white">{quotes.length}</strong>
            </span>

            <button
              onClick={onClearAll}
              className="text-xs text-red-400 hover:text-red-300 font-semibold transition-colors"
            >
              مسح جميع العروض
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
