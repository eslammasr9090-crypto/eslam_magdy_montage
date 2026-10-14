
import React, { useRef } from 'react';
import { InvoiceDetails } from '../types';

interface HeaderProps {
  details: InvoiceDetails;
  updateDetails: (field: keyof InvoiceDetails, value: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ details, updateDetails }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLogoClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) {
          updateDetails('logo', ev.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <header className="flex justify-between items-start py-[30px] px-[40px] border-b-[3px] border-brand min-h-[170px]">
      
      {/* Right Side: Logo */}
      <div className="w-[30%] text-right">
        <div 
          id="logoPreview"
          className={`w-[110px] h-[110px] inline-flex items-center justify-center cursor-pointer bg-contain bg-center bg-no-repeat ${details.logo ? '' : 'border-2 border-dashed border-gray-300 rounded-[10px]'}`}
          onClick={handleLogoClick}
          title="اضغط لتغيير الشعار"
        >
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept="image/*" 
            onChange={handleFileChange}
          />
          {details.logo ? (
            <img src={details.logo} alt="Logo" className="w-full h-full object-contain rounded-[10px]" />
          ) : (
            <span className="text-[12px] text-gray-400 font-sans">اضغط لإضافة اللوجو</span>
          )}
        </div>
      </div>

      {/* Center: Company Name & Tax Number */}
      <div className="flex-1 text-center flex flex-col justify-center gap-[5px] mt-[5px]">
        <h1 className="text-[26px] font-[800] text-brand leading-[1.2]">شركة التصميم الحديث</h1>
        <h2 className="text-[16px] text-[#555] font-normal">للدعاية والإعلان</h2>
        <div className="text-[12px] text-brand tracking-[1px] font-bold uppercase mt-[5px]">
          Modern Design Advertising Company
        </div>
        {/* Tax Number - Plain text without box */}
        <div className="text-[14px] font-bold text-[#333] mt-[5px]">
           الرقم الضريبي: <span className="font-sans">{details.taxNumber}</span>
        </div>
      </div>

      {/* Left Side: Invoice Meta Data - Split into two separate boxes */}
      <div className="w-[220px] flex flex-col gap-[10px] items-end">
        
        {/* Box 1: Offer Number */}
        <div className="bg-brand text-white py-[10px] px-[15px] rounded-tl-[15px] rounded-br-[15px] rounded-bl-[0px] w-full flex justify-between items-center shadow-sm">
            <span className="text-[14px] font-bold">رقم العرض</span>
            <input 
              type="text" 
              value={details.invoiceNumber}
              onChange={(e) => updateDetails('invoiceNumber', e.target.value)}
              className="bg-transparent text-white text-left font-extrabold text-[16px] w-[90px] outline-none ltr"
              style={{ direction: 'ltr' }}
            />
        </div>
        
        {/* Box 2: Date */}
        <div className="bg-brand text-white py-[10px] px-[15px] rounded-tl-[15px] rounded-br-[15px] rounded-bl-[0px] w-full flex justify-between items-center shadow-sm">
            <span className="text-[14px] font-bold">التاريخ</span>
            <input 
              type="text" 
              value={details.date}
              onChange={(e) => updateDetails('date', e.target.value)}
              className="bg-transparent text-white text-left font-sans font-extrabold text-[16px] outline-none w-[90px] ltr"
              style={{ direction: 'ltr' }}
            />
        </div>

      </div>
    </header>
  );
};
