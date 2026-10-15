
import React, { useRef } from 'react';
import { InvoiceDetails } from '../types';

interface FooterProps {
  subTotal: number;
  vat: number;
  total: number;
  details: InvoiceDetails;
  updateDetails: (field: keyof InvoiceDetails, value: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ subTotal, vat, total, details, updateDetails }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleStampClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) {
          updateDetails('stamp', ev.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Helper to format currency
  const fmt = (n: number) => n.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 });

  return (
    <footer className="mt-auto flex flex-col">
      {/* Main Footer Area: Left aligned stack (Visually Left in RTL which is flex-end) */}
      <div className="flex justify-end px-[40px] mt-[20px]">
        <div className="w-[350px] flex flex-col items-center">
          
          {/* 1. Totals Block */}
          <div className="w-full mb-[15px]">
            <div className="flex mb-[2px]">
              <div className="w-1/2 bg-brand text-white flex flex-col items-center justify-center py-[4px] font-bold shadow-sm">
                <span className="text-[13px] leading-tight">الإجمالي</span>
                <span className="text-[10px] uppercase font-bold opacity-90 tracking-tighter">Sub Total</span>
              </div>
              <div className="w-1/2 border border-[#ccc] bg-white flex items-center justify-center">
                <input readOnly value={fmt(subTotal)} className="w-full h-full border-none text-center font-[900] text-[16px] text-black outline-none bg-white" />
              </div>
            </div>
            <div className="flex mb-[2px]">
              <div className="w-1/2 bg-brand text-white flex flex-col items-center justify-center py-[4px] font-bold shadow-sm">
                <span className="text-[13px] leading-tight">القيمة المضافة 15%</span>
                <span className="text-[10px] uppercase font-bold opacity-90 tracking-tighter">V.A.T 15%</span>
              </div>
              <div className="w-1/2 border border-[#ccc] bg-white flex items-center justify-center">
                <input readOnly value={fmt(vat)} className="w-full h-full border-none text-center font-[900] text-[16px] text-black outline-none bg-white" />
              </div>
            </div>
            <div className="flex">
              <div className="w-1/2 bg-[#0f6654] text-white flex flex-col items-center justify-center py-[4px] font-bold shadow-sm">
                <span className="text-[14px] leading-tight">الإجمالي النهائي</span>
                <span className="text-[10px] uppercase font-bold opacity-90 tracking-tighter">Total Incl. VAT</span>
              </div>
              <div className="w-1/2 border border-[#0f6654] bg-[#e1f5f0] flex items-center justify-center">
                 <input readOnly value={fmt(total)} className="w-full h-full border-none text-center font-[900] text-[19px] text-[#0f6654] outline-none bg-transparent" />
              </div>
            </div>
          </div>

          {/* 2. Manager Title */}
          <div className="flex flex-col items-center mb-[2px] self-center">
             <span className="text-[#333] font-bold text-[16px]">الإدارة</span>
             <span className="text-[#666] text-[12px] uppercase font-semibold">Manager</span>
          </div>

          {/* 3. Stamp Area */}
          <input 
             type="file" 
             ref={fileInputRef} 
             className="hidden" 
             accept="image/*" 
             onChange={handleFileChange}
          />
          <div 
            id="stampPreview"
            className={`w-[200px] h-[200px] block cursor-pointer bg-contain bg-center bg-no-repeat mt-0 ${details.stamp ? 'opacity-90' : 'border-2 border-dashed border-[#ccc] rounded-full flex items-center justify-center'}`}
            style={details.stamp ? { backgroundImage: `url(${details.stamp})` } : undefined}
            onClick={handleStampClick}
            title="اضغط لإضافة الختم"
          >
             {!details.stamp && (
               <span className="text-[#999]">مكان الختم</span>
             )}
          </div>
        </div>
      </div>
      
      {/* Bottom Bar: Bank Info */}
      <div className="bg-brand text-white text-center text-[12px] py-[10px] mt-auto w-full">
         المملكة العربية السعودية - الرياض - سجل تجاري: 1010639899 | التحويل البنكي: بنك البلاد <span className="font-sans font-bold select-all">SA6015000435136527570008</span>
      </div>
    </footer>
  );
};
