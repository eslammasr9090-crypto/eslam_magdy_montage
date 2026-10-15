
import React, { useState, useEffect } from 'react';
import { flushSync } from 'react-dom';
import { Plus, Trash2, RotateCcw, Image as ImageIcon, FileText, History, Save, X } from 'lucide-react';
import { InvoiceItem, InvoiceDetails, SavedQuotation, PREDEFINED_ITEMS, PREDEFINED_SIZES } from './types';
import { Header } from './components/Header';
import { Footer } from './components/Footer';

// Declare external libraries loaded via script tags
declare const domtoimage: any;
declare const saveAs: any;
declare const html2pdf: any;

// Initial Helper
const createEmptyItem = (): InvoiceItem => ({
  id: Math.random().toString(36).substr(2, 9),
  description: '',
  size: '',
  quantity: 1,
  unitPrice: 0
});

const App: React.FC = () => {
  // --- State ---
  const [items, setItems] = useState<InvoiceItem[]>(() => {
      return Array(6).fill(null).map(createEmptyItem);
  });

  const [details, setDetails] = useState<InvoiceDetails>({
    date: new Date().toISOString().split('T')[0],
    invoiceNumber: '8000',
    customerName: '',
    logo: undefined,
    stamp: undefined,
    taxNumber: '311118338600003',
    commercialRegistrationNumber: '1010639899'
  });

  const [editingId, setEditingId] = useState<string | null>(null);

  const [zoom, setZoom] = useState<number>(0.9);
  const [isExporting, setIsExporting] = useState(false);
  const [savedQuotations, setSavedQuotations] = useState<SavedQuotation[]>(() => {
    try {
      const saved = localStorage.getItem('quotation_history');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error('Error parsing saved quotations:', e);
      return [];
    }
  });
  const [showHistory, setShowHistory] = useState(false);

  // --- Effects ---
  useEffect(() => {
    try {
      localStorage.setItem('quotation_history', JSON.stringify(savedQuotations));
    } catch (e) {
      console.error('Error saving quotations to localStorage:', e);
    }
  }, [savedQuotations]);

  // --- Calculations ---
  const subTotal = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
  const vat = subTotal * 0.15;
  const total = subTotal + vat;

  // --- Handlers ---
  const handleAddItem = () => {
    setItems([...items, createEmptyItem()]);
  };

  const handleRemoveItem = (id: string) => {
    if (items.length <= 1) return;
    setItems(items.filter(item => item.id !== id));
  };

  const handleUpdateItem = (id: string, field: keyof InvoiceItem, value: string | number) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  // Reverse Calc: Total / Qty = Price
  const handleReverseCalc = (id: string, totalValue: string) => {
    const sanitizedVal = totalValue.replace(/,/g, '');
    const newTotal = parseFloat(sanitizedVal);
    if (isNaN(newTotal)) return;

    setItems(items.map(item => {
      if (item.id === id) {
        const qty = item.quantity || 1;
        const newPrice = newTotal / qty;
        return { ...item, unitPrice: newPrice };
      }
      return item;
    }));
  };

  const handleDetailsChange = (field: keyof InvoiceDetails, value: string) => {
    setDetails(prev => ({ ...prev, [field]: value }));
  };

  const handleDownloadPDF = () => {
    const element = document.getElementById('invoice-container');
    const addButton = document.getElementById('btn-add-row');
    const deleteButtons = document.querySelectorAll('.delete-btn');
    
    if (element && addButton) {
      const originalTransform = element.style.transform;
      element.style.transform = 'scale(1)';
      document.body.classList.add('saving-mode');
      addButton.style.display = 'none';
      deleteButtons.forEach(btn => (btn as HTMLElement).style.display = 'none');
      flushSync(() => setIsExporting(true));

      const restore = () => {
        setIsExporting(false);
        document.body.classList.remove('saving-mode');
        addButton.style.display = 'flex';
        deleteButtons.forEach(btn => (btn as HTMLElement).style.display = '');
        element.style.transform = originalTransform;
      };

      const opt = {
        margin: 0,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 4, useCORS: true, scrollY: 0 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };

      const worker = html2pdf().set(opt).from(element).toCanvas();
      worker.get('canvas').then((canvas: HTMLCanvasElement) =>
        worker.toPdf().get('pdf').then((pdf: any) => {
          const generatedPages = pdf.getNumberOfPages();
          pdf.addPage('a4', 'portrait');
          for (let i = generatedPages; i >= 1; i--) pdf.deletePage(i);
          const pageW = pdf.internal.pageSize.getWidth();
          const pageH = pdf.internal.pageSize.getHeight();
          const ratio = Math.min(pageW / canvas.width, pageH / canvas.height);
          const w = canvas.width * ratio;
          const h = canvas.height * ratio;
          pdf.addImage(canvas.toDataURL('image/jpeg', 1.0), 'JPEG', (pageW - w) / 2, 0, w, h, undefined, 'NONE');
          pdf.save(`عرض_سعر_${details.customerName || 'جديد'}.pdf`);
        })
      ).then(restore, (error: any) => {
        console.error('Error saving PDF:', error);
        restore();
      });
    }
  };

  const handleSaveImage = () => {
    const element = document.getElementById('invoice-container');
    const addButton = document.getElementById('btn-add-row');
    const deleteButtons = document.querySelectorAll('.delete-btn');
    
    if (element && addButton) {
      const originalTransform = element.style.transform;
      element.style.transform = 'scale(1)';
      document.body.classList.add('saving-mode');
      addButton.style.display = 'none';
      deleteButtons.forEach(btn => (btn as HTMLElement).style.display = 'none');

      const scale = 2;
      const style = {
        transform: 'scale(' + scale + ')',
        transformOrigin: 'top left',
        width: element.offsetWidth + 'px',
        height: element.offsetHeight + 'px'
      };

      const param = {
        height: element.offsetHeight * scale,
        width: element.offsetWidth * scale,
        quality: 0.95,
        style: style,
        bgcolor: '#ffffff'
      };

      domtoimage.toJpeg(element, param)
        .then((dataUrl: string) => {
          saveAs(dataUrl, `offer_${details.invoiceNumber.replace('/', '-')}.jpg`);
          document.body.classList.remove('saving-mode');
          addButton.style.display = 'flex';
          deleteButtons.forEach(btn => (btn as HTMLElement).style.display = '');
          element.style.transform = originalTransform;
        })
        .catch((error: any) => {
          console.error('Error saving image:', error);
          document.body.classList.remove('saving-mode');
          addButton.style.display = 'flex';
          deleteButtons.forEach(btn => (btn as HTMLElement).style.display = '');
          element.style.transform = originalTransform;
        });
    }
  };

  const handleSaveDraft = (auto = false) => {
    // Don't save empty/useless drafts
    if (!details.customerName && items.every(item => !item.description)) {
      if (!auto) alert('يرجى إدخال بيانات العميل أو صنف واحد على الأقل للحفظ.');
      return;
    }

    if (editingId) {
      // Update existing
      setSavedQuotations(prev => prev.map(q => 
        q.id === editingId 
          ? { ...q, items: [...items], details: { ...details }, timestamp: Date.now() }
          : q
      ));
      if (!auto) alert('تم تحديث العرض في السجل بنجاح.');
    } else {
      // Create new
      const newSaved: SavedQuotation = {
        id: Math.random().toString(36).substr(2, 9),
        timestamp: Date.now(),
        items: [...items],
        details: { ...details }
      };
      setSavedQuotations(prev => [newSaved, ...prev]);
      setEditingId(newSaved.id); // Now we are editing this new one
      if (!auto) alert('تم حفظ المسودة في السجل بنجاح.');
    }
  };

  const handleLoadQuotation = (saved: SavedQuotation) => {
    setItems(saved.items);
    setDetails(saved.details);
    setEditingId(saved.id);
    setShowHistory(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Trigger height adjustment for textareas after state update
    setTimeout(() => {
        const textareas = document.querySelectorAll('textarea');
        textareas.forEach(ta => {
            ta.style.height = 'auto';
            ta.style.height = ta.scrollHeight + 'px';
        });
    }, 100);
  };

  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [confirmDeleteAll, setConfirmDeleteAll] = useState(false);

  const handleDeleteSaved = (id: string) => {
    setSavedQuotations(prev => prev.filter(q => q.id !== id));
    if (editingId === id) setEditingId(null);
    setConfirmDeleteId(null);
  };

  const handleDeleteAll = () => {
    setSavedQuotations([]);
    setEditingId(null);
    setConfirmDeleteAll(false);
  };

  const handleReset = () => {
    // Auto-save current work to history if it has data
    const hasData = details.customerName || items.some(item => item.description || item.unitPrice > 0);
    if (hasData) {
        handleSaveDraft(true);
    }

    let nextNumber = 8000;
    const currentNum = parseInt(details.invoiceNumber);
    if (!isNaN(currentNum)) {
        nextNumber = currentNum + 1;
    } else {
        const matches = details.invoiceNumber.match(/\d+/);
        if (matches) {
            nextNumber = parseInt(matches[0]) + 1;
        }
    }

    setItems(Array(6).fill(null).map(createEmptyItem));
    setDetails(prev => ({
        ...prev,
        date: new Date().toISOString().split('T')[0],
        invoiceNumber: nextNumber.toString(),
        customerName: '',
    }));
    setEditingId(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const formatCurrency = (val: number) => {
    if (val === 0) return '';
    return val.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
  };

  return (
    <div className="min-h-screen p-5 flex flex-col items-center">
      
      <datalist id="sizeOptionsList">
        {PREDEFINED_SIZES.map(size => (
          <option key={size} value={size} />
        ))}
      </datalist>

      <datalist id="itemsOptionsList">
        {PREDEFINED_ITEMS.map(item => (
          <option key={item} value={item} />
        ))}
      </datalist>

      {/* --- Control Bar --- */}
      <div className="w-full max-w-[900px] mb-5 flex flex-wrap gap-4 justify-center items-center print:hidden bg-white p-4 rounded-xl shadow-[0_4px_10px_rgba(0,0,0,0.2)] sticky top-2 z-50">
        
        <div className="flex items-center gap-2 bg-[#f0f0f0] px-4 py-2 rounded-full border border-gray-300">
            <span className="text-[12px] font-bold text-gray-700">🔍 تكبير/تصغير:</span>
            <input 
                type="range" 
                min="0.5" 
                max="1.3" 
                step="0.1" 
                value={zoom} 
                onChange={(e) => setZoom(parseFloat(e.target.value))}
                className="w-[100px] accent-brand cursor-pointer"
            />
        </div>

        <div className="flex gap-3 flex-wrap justify-center">
           <button 
            onClick={handleSaveImage}
            className="flex items-center gap-2 px-5 py-2 bg-[#e67e22] hover:bg-[#d35400] text-white rounded-[5px] text-[14px] font-bold transition-colors shadow-sm"
          >
            <ImageIcon size={18} /> <span>حفظ صورة (Image)</span>
          </button>
          
          <button 
            onClick={handleDownloadPDF}
            className="flex items-center gap-2 px-5 py-2 bg-brand hover:bg-brand-dark text-white rounded-[5px] text-[14px] font-bold shadow-sm transition-colors"
          >
            <FileText size={18} /> <span>تحميل ملف (PDF)</span>
          </button>

          <button 
            type="button"
            onClick={handleReset}
            className="flex items-center gap-2 px-5 py-2 text-white bg-[#444] hover:bg-gray-700 rounded-[5px] text-[14px] font-bold transition-all active:scale-95 cursor-pointer shadow-sm"
          >
            <RotateCcw size={18} /> <span>عرض جديد</span>
          </button>

          <button 
            type="button"
            onClick={() => {
              console.log("Opening history...");
              setShowHistory(true);
            }}
            className="flex items-center gap-2 px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-[5px] text-[14px] font-bold shadow-sm transition-all active:scale-95 cursor-pointer relative"
            title="سجل عروض الأسعار"
          >
            <History size={18} /> <span>السجل</span>
            {editingId && (
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
            )}
          </button>
        </div>
      </div>

      {/* --- History Sidebar --- */}
      {showHistory && (
        <div className="fixed inset-0 z-[100] flex rtl:justify-end ltr:justify-end print:hidden">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" onClick={() => setShowHistory(false)} />
          <div className="relative w-full max-w-[400px] bg-gray-50 h-full shadow-2xl flex flex-col transition-transform duration-300 transform translate-x-0">
            <div className="p-4 bg-brand text-white flex justify-between items-center shadow-md">
              <div className="flex items-center gap-2">
                <History size={20} />
                <h2 className="text-xl font-bold">سجل عروض الأسعار</h2>
              </div>
              <div className="flex items-center gap-2">
                {savedQuotations.length > 0 && (
                  <div className="flex items-center gap-2">
                    {confirmDeleteAll ? (
                      <div className="flex items-center gap-1">
                         <button 
                          onClick={handleDeleteAll}
                          className="bg-red-600 text-white px-3 py-1 rounded-full text-[12px] font-bold hover:bg-red-700 animate-pulse"
                        >
                          تأكيد المسح؟
                        </button>
                        <button 
                          onClick={() => setConfirmDeleteAll(false)}
                          className="bg-white/20 text-white p-1 rounded-full hover:bg-white/30"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ) : (
                      <button 
                        onClick={() => setConfirmDeleteAll(true)}
                        className="p-2 hover:bg-red-500 rounded-full transition-colors flex items-center justify-center gap-1 text-[12px] font-bold"
                        title="مسح السجل بالكامل"
                      >
                        <Trash2 size={16} /> <span>مسح الكل</span>
                      </button>
                    )}
                  </div>
                )}
                <button 
                  onClick={() => setShowHistory(false)}
                  className="p-2 hover:bg-white/20 rounded-full transition-colors flex items-center justify-center"
                >
                  <X size={24} />
                </button>
              </div>
            </div>
            
            <div className="flex-grow overflow-y-auto p-4 flex flex-col gap-3">
              {savedQuotations.length === 0 ? (
                <div className="text-center py-20 text-gray-400">
                  <div className="mb-4 flex justify-center opacity-20"><History size={64} /></div>
                  <p className="font-bold">لا توجد عروض محفوظة حالياً</p>
                </div>
              ) : (
                savedQuotations.map((saved) => (
                  <div 
                    key={saved.id}
                    onClick={() => handleLoadQuotation(saved)}
                    className="bg-white border border-gray-200 p-4 rounded-xl shadow-sm hover:shadow-md hover:border-brand cursor-pointer transition-all group relative border-r-4 border-r-transparent hover:border-r-brand"
                  >
                    <div className="flex justify-between items-start mb-2">
                        <span className="text-[12px] bg-brand/10 text-brand px-2 py-1 rounded font-bold">
                            #{saved.details.invoiceNumber}
                        </span>
                        <span className="text-[11px] text-gray-400">
                            {new Date(saved.timestamp).toLocaleString('ar-SA')}
                        </span>
                    </div>
                    <div className="font-[800] text-gray-800 mb-1 truncate text-[15px]">
                        {saved.details.customerName || '(بدون اسم عميل)'}
                    </div>
                    <div className="text-[12px] text-gray-500 font-bold">
                        {saved.items.filter(i => i.description).length} أصناف
                    </div>
                    {confirmDeleteId === saved.id ? (
                      <div className="absolute bottom-4 left-4 flex gap-2" onClick={(e) => e.stopPropagation()}>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteSaved(saved.id);
                          }}
                          className="bg-red-600 text-white px-3 py-1 rounded-lg text-[11px] font-bold hover:bg-red-700 shadow-sm"
                        >
                          تأكيد الحذف
                        </button>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setConfirmDeleteId(null);
                          }}
                          className="bg-gray-200 text-gray-700 px-3 py-1 rounded-lg text-[11px] font-bold hover:bg-gray-300 shadow-sm"
                        >
                          إلغاء
                        </button>
                      </div>
                    ) : (
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          setConfirmDeleteId(saved.id);
                        }}
                        className="absolute bottom-4 left-4 p-3 text-gray-400 hover:text-red-600 transition-colors bg-gray-50 rounded-lg border border-gray-100 hover:border-red-100 hover:bg-red-50"
                        title="حذف من السجل"
                      >
                        <Trash2 size={20} />
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
            
            <div className="p-4 border-t border-gray-200 bg-white">
              <button 
                onClick={() => handleSaveDraft()}
                className="w-full py-4 bg-brand text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-brand-dark transition-colors shadow-lg active:scale-[0.98]"
              >
                <Save size={20} /> حفظ العرض الحالي يدوياً
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- A4 Page Container --- */}
      <div style={{ transform: `scale(${zoom})`, transformOrigin: 'top center', transition: 'transform 0.2s ease' }} className="print:!transform-none origin-top">
        
        <div id="invoice-container" className="w-[210mm] min-h-[297mm] bg-white shadow-[0_0_20px_rgba(0,0,0,0.5)] print:shadow-none mx-auto relative flex flex-col print:w-full print:m-0 pb-[50px] box-border">
            
            <Header details={details} updateDetails={handleDetailsChange} />

            <div className="mx-auto my-[25px] w-[60%] border border-[#ddd] px-[30px] py-[10px] rounded-[50px] shadow-[0_3px_6px_rgba(0,0,0,0.05)] bg-white flex flex-col justify-center items-center text-center">
               <div className="font-[800] text-[20px] text-[#333] mb-[2px]">♦ عــرض ســعــر ♦</div>
               <div className="font-[600] text-[14px] text-[#777] tracking-[1px]">Offer Price</div>
            </div>

            <div className="mb-[20px] px-[40px]">
                <div className="flex items-center gap-2 text-[16px] mb-[5px]">
                    <span className="font-bold text-brand text-lg">السادة</span>
                    {isExporting ? (
                      <span className="w-[70%] border-b border-solid border-[#ccc] px-2 py-0 text-black font-bold font-sans text-[16px] leading-[1.6] min-h-[1.6em]">
                        {details.customerName}
                      </span>
                    ) : (
                    <input 
                        type="text" 
                        placeholder="اسم العميل أو المؤسسة"
                        value={details.customerName}
                        onChange={(e) => handleDetailsChange('customerName', e.target.value)}
                        className="customer-input w-[70%] border-b border-dashed border-[#999] outline-none px-2 py-0 bg-transparent text-black font-bold placeholder-gray-400 font-sans text-[16px]"
                    />
                    )}
                </div>
                <p className="text-[13px] text-[#666] mt-0">
                    يسرنا نحن شركة التصميم الحديث أن نتقدم إليكم بعرض السعر التالي...
                </p>
            </div>

            <div className="px-[30px] flex-grow">
                <table className="w-full border-collapse table-fixed" dir="rtl">
                    <thead>
                        <tr className="bg-brand text-white">
                            <th className="border border-white py-2 px-1 w-[4%] font-bold">
                                <div className="flex flex-col items-center leading-none gap-1">
                                    <span className="text-[14px]">م</span>
                                    <span className="text-[10px] uppercase font-bold tracking-tighter opacity-90">No.</span>
                                </div>
                            </th>
                            <th className="border border-white py-2 px-4 w-[45%] font-bold">
                                <div className="flex flex-col items-center leading-none gap-1">
                                    <span className="text-[14px]">البيان</span>
                                    <span className="text-[10px] uppercase font-bold tracking-widest opacity-90">Description</span>
                                </div>
                            </th>
                            <th className="border border-white py-2 px-2 w-[12%] font-bold">
                                <div className="flex flex-col items-center leading-none gap-1 text-center">
                                    <span className="text-[14px]">المقاس</span>
                                    <span className="text-[10px] uppercase font-bold tracking-wider opacity-90">Size</span>
                                </div>
                            </th>
                            <th className="border border-white py-2 px-2 w-[13%] font-bold">
                                <div className="flex flex-col items-center leading-none gap-1 text-center">
                                    <span className="text-[14px]">العدد</span>
                                    <span className="text-[10px] uppercase font-bold tracking-widest opacity-90">Qty</span>
                                </div>
                            </th>
                            <th className="border border-white py-2 px-2 w-[13%] font-bold">
                                <div className="flex flex-col items-center leading-none gap-1 text-center">
                                    <span className="text-[14px]">السعر</span>
                                    <span className="text-[10px] uppercase font-bold tracking-widest opacity-90">Unit Price</span>
                                </div>
                            </th>
                            <th className="border border-white py-2 px-2 w-[13%] font-bold">
                                <div className="flex flex-col items-center leading-none gap-1 text-center">
                                    <span className="text-[14px]">الإجمالي</span>
                                    <span className="text-[10px] uppercase font-bold tracking-wider opacity-90">Total</span>
                                </div>
                            </th>
                            <th className="w-8 bg-white print:hidden border-none print-hidden"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((item, index) => (
                            <tr key={item.id} className="group hover:bg-gray-5 min-h-[48px]">
                                <td className="border border-[#ccc] text-center text-gray-700 py-0 font-bold bg-white">
                                    {index + 1}
                                </td>
                                <td className="border border-[#ccc] p-0 bg-white align-middle">
                                    <textarea 
                                        value={item.description}
                                        onChange={(e) => handleUpdateItem(item.id, 'description', e.target.value)}
                                        rows={1}
                                        className="w-full h-full px-2 py-3 outline-none bg-transparent text-black font-[900] text-[16px] placeholder-gray-300 text-center resize-none block overflow-hidden leading-tight"
                                        placeholder="اكتب البيان هنا..."
                                        onInput={(e) => {
                                            const target = e.target as HTMLTextAreaElement;
                                            target.style.height = 'auto';
                                            target.style.height = (target.scrollHeight) + 'px';
                                        }}
                                        onFocus={(e) => {
                                            const target = e.target as HTMLTextAreaElement;
                                            target.style.height = 'auto';
                                            target.style.height = (target.scrollHeight) + 'px';
                                        }}
                                    />
                                </td>
                                <td className="border border-[#ccc] p-0 bg-white">
                                    <input 
                                        type="text"
                                        list="sizeOptionsList"
                                        value={item.size}
                                        onChange={(e) => handleUpdateItem(item.id, 'size', e.target.value)}
                                        className="w-full min-h-[48px] text-center outline-none bg-transparent text-black font-[900] text-[17px]"
                                        placeholder="-"
                                    />
                                </td>
                                <td className="border border-[#ccc] p-0 bg-white">
                                    <input 
                                        type="number"
                                        min="0"
                                        step="0.1"
                                        value={item.quantity}
                                        onFocus={(e) => e.target.select()}
                                        onChange={(e) => handleUpdateItem(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                                        className="w-full min-h-[48px] text-center outline-none bg-transparent font-[900] text-black text-[18px]"
                                        placeholder="0"
                                    />
                                </td>
                                <td className="border border-[#ccc] p-0 bg-white">
                                    <input 
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={item.unitPrice}
                                        onFocus={(e) => e.target.select()}
                                        onChange={(e) => handleUpdateItem(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                                        className="w-full min-h-[48px] text-center outline-none bg-transparent font-[900] text-black text-[18px]"
                                        placeholder="0.00"
                                    />
                                </td>
                                <td className="border border-[#ccc] p-0 bg-white relative">
                                    <input 
                                        type="text"
                                        onBlur={(e) => handleReverseCalc(item.id, e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                handleReverseCalc(item.id, (e.target as HTMLInputElement).value);
                                                (e.target as HTMLInputElement).blur();
                                            }
                                        }}
                                        key={item.quantity * item.unitPrice} 
                                        defaultValue={formatCurrency(item.quantity * item.unitPrice)}
                                        className="w-full min-h-[48px] text-center outline-none bg-transparent font-[900] text-black text-[18px]"
                                        placeholder="0.00"
                                    />
                                </td>
                                <td className="print:hidden print-hidden pl-2 text-center border-none bg-transparent">
                                    <button 
                                        onClick={() => handleRemoveItem(item.id)}
                                        className="text-red-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity delete-btn"
                                        title="حذف الصف"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                
                <button 
                    id="btn-add-row"
                    onClick={handleAddItem}
                    className="my-[15px] w-full py-2 border-2 border-dashed border-brand text-brand hover:bg-brand-light font-bold cursor-pointer transition-colors print:hidden flex items-center justify-center gap-2 bg-transparent"
                >
                    <Plus size={18} /> إضافة صنف جديد
                </button>
            </div>

            <Footer 
                subTotal={subTotal} 
                vat={vat} 
                total={total} 
                details={details}
                updateDetails={handleDetailsChange}
            />

        </div>
      </div>
      
    </div>
  );
};

export default App;
