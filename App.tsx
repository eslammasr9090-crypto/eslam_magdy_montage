import React, { useState } from 'react';
import QuotationApp from './quotation/App';
import MontageApp from './montage/App';
import BoxesApp from './boxes/App';

type Tool = 'quotation' | 'montage' | 'boxes';

const TOOLS: { id: Tool; label: string }[] = [
  { id: 'quotation', label: 'Quotation' },
  { id: 'montage', label: 'Digital Montage' },
  { id: 'boxes', label: 'Box Pricing Calculator' },
];
const getInitialTool = (): Tool =>
  window.location.hash === '#montage'
    ? 'montage'
    : window.location.hash === '#boxes'
      ? 'boxes'
      : 'quotation';
const App: React.FC = () => {
  const [tool, setTool] = useState<Tool>(getInitialTool);

  const selectTool = (id: Tool) => {
    setTool(id);
    window.location.hash = id;
  };

  return (
    <>
      <nav className="no-print print-hidden sticky top-0 z-50 bg-gray-900 shadow-md" dir="rtl">
        <div className="max-w-6xl mx-auto flex flex-wrap justify-center gap-2 p-2">
          {TOOLS.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => selectTool(id)}
              className={`px-4 py-2 rounded-lg text-sm sm:text-base font-bold transition-colors ${
                tool === id ? 'bg-brand text-white' : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </nav>

{tool === 'quotation' ? (
  <div className="bg-[#555] min-h-screen">
    <QuotationApp />
  </div>
) : tool === 'montage' ? (
  <MontageApp />
) : (
  <BoxesApp />
)}
    </>
  );
};

export default App;
