
import React from 'react';
import { Input } from './Input';
import { Select } from './Select';

interface QuantityInputProps {
  quantity: string;
  setQuantity: (value: string) => void;
  maounType: string;
  setMaounType: (value: string) => void;
}

export const QuantityInput: React.FC<QuantityInputProps> = ({
  quantity,
  setQuantity,
  maounType,
  setMaounType,
}) => {
  return (
    <section className="space-y-4">
        <h3 className="text-xl font-bold border-b border-gray-100 pb-2">الكمية والورق | Quantity & Paper</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
            <label htmlFor="qty" className="block text-sm font-bold text-slate-600 mb-1">الكمية المطلوبة | Total Qty</label>
            <Input id="qty" type="number" min="0" placeholder="مثال: 5000" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
            </div>
            <div>
            <label htmlFor="maounType" className="block text-sm font-bold text-slate-600 mb-1">نوع المعون | Paper Type</label>
            <Select id="maounType" value={maounType} onChange={(e) => setMaounType(e.target.value)}>
                <option value="">— بدون حساب معون —</option>
                <option value="heavy">معون 300–350جم (100 ورقة 100×70 = 400 شيت 33×48.7)</option>
                <option value="light">معون 150–170جم (250 ورقة 100×70 = 1000 شيت 33×48.7)</option>
            </Select>
            </div>
        </div>
    </section>
  );
};
