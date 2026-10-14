import React from 'react';
import type { BestFit } from '../types';

interface SheetVisualizerProps {
  sheetWidth: number;
  sheetHeight: number;
  itemWidth: number;
  itemHeight: number;
  margin: number;
  gutter: number;
  fitResult?: BestFit;
}

export const SheetVisualizer: React.FC<SheetVisualizerProps> = ({
  sheetWidth,
  sheetHeight,
  itemWidth,
  itemHeight,
  margin,
  gutter,
  fitResult,
}) => {
  if (!sheetWidth || !sheetHeight) return null;

  const aspectRatio = `${sheetWidth} / ${sheetHeight}`;
  
  const renderVisuals = () => {
    // Only render margin mask if there's no result
    if (!fitResult || !itemWidth || !itemHeight || fitResult.total === 0) {
      if (margin > 0 && sheetWidth > 0 && sheetHeight > 0) {
        const marginXPct = (margin / sheetWidth) * 100;
        const marginYPct = (margin / sheetHeight) * 100;
        const marginMaskStyle = {
            left: `${marginXPct}%`, right: `${marginXPct}%`,
            top: `${marginYPct}%`, bottom: `${marginYPct}%`,
        };
        return <div className="absolute inset-0 border-2 border-dashed border-gray-400 pointer-events-none" style={marginMaskStyle}></div>;
      }
      return null;
    }

    const items: React.ReactNode[] = [];
    const cropMarks: React.ReactNode[] = [];

    const { orient, rows, cols } = fitResult;

    const unitW = orient === 'طولي' ? itemWidth : itemHeight;
    const unitH = orient === 'طولي' ? itemHeight : itemWidth;

    const usableW = Math.max(sheetWidth - 2 * margin, 0);
    const usableH = Math.max(sheetHeight - 2 * margin, 0);

    const totalUsedW = cols * unitW + (cols - 1) * gutter;
    const totalUsedH = rows * unitH + (rows - 1) * gutter;

    const leftoverW = Math.max(usableW - totalUsedW, 0);
    const leftoverH = Math.max(usableH - totalUsedH, 0);

    const startX = ((margin + leftoverW / 2) / sheetWidth) * 100;
    const startY = ((margin + leftoverH / 2) / sheetHeight) * 100;

    const unitWPct = (unitW / sheetWidth) * 100;
    const unitHPct = (unitH / sheetHeight) * 100;
    const gutterWPct = (gutter / sheetWidth) * 100;
    const gutterHPct = (gutter / sheetHeight) * 100;

    const gridWPct = (totalUsedW / sheetWidth) * 100;
    const gridHPct = (totalUsedH / sheetHeight) * 100;

    // Render items with numbers
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const style = {
          width: `${unitWPct}%`,
          height: `${unitHPct}%`,
          left: `${startX + c * (unitWPct + gutterWPct)}%`,
          top: `${startY + r * (unitHPct + gutterHPct)}%`,
        };
        items.push(
            <div key={`item-${r}-${c}`} className="absolute border border-gray-900 bg-accent opacity-95 box-border" style={style}>
                <span className="item-number">{r * cols + c + 1}</span>
            </div>
        );
      }
    }

    // Render Crop Marks (main boundaries)
    const tickLenPct = 1.5;

    // Vertical marks for each column start and end
    for (let c = 0; c <= cols; c++) {
        const xStart = startX + c * (unitWPct + gutterWPct);
        const xEnd = xStart - gutterWPct; // End of item, before gutter
        
        // Mark at start of item c
        if (c < cols) {
          cropMarks.push(<div key={`vt-s-${c}`} className="crop-mark crop-mark-v" style={{ left: `${xStart}%`, top: `${startY - tickLenPct}%`, height: `${tickLenPct}%` }} />);
          cropMarks.push(<div key={`vb-s-${c}`} className="crop-mark crop-mark-v" style={{ left: `${xStart}%`, top: `${startY + gridHPct}%`, height: `${tickLenPct}%` }} />);
        }
        // Mark at end of item c-1
        if (c > 0) {
          cropMarks.push(<div key={`vt-e-${c}`} className="crop-mark crop-mark-v" style={{ left: `${xEnd}%`, top: `${startY - tickLenPct}%`, height: `${tickLenPct}%` }} />);
          cropMarks.push(<div key={`vb-e-${c}`} className="crop-mark crop-mark-v" style={{ left: `${xEnd}%`, top: `${startY + gridHPct}%`, height: `${tickLenPct}%` }} />);
        }
    }

    // Horizontal marks for each row start and end
    for (let r = 0; r <= rows; r++) {
        const yStart = startY + r * (unitHPct + gutterHPct);
        const yEnd = yStart - gutterHPct;

        if (r < rows) {
          cropMarks.push(<div key={`hl-s-${r}`} className="crop-mark crop-mark-h" style={{ top: `${yStart}%`, left: `${startX - tickLenPct}%`, width: `${tickLenPct}%` }} />);
          cropMarks.push(<div key={`hr-s-${r}`} className="crop-mark crop-mark-h" style={{ top: `${yStart}%`, left: `${startX + gridWPct}%`, width: `${tickLenPct}%` }} />);
        }
        if (r > 0) {
          cropMarks.push(<div key={`hl-e-${r}`} className="crop-mark crop-mark-h" style={{ top: `${yEnd}%`, left: `${startX - tickLenPct}%`, width: `${tickLenPct}%` }} />);
          cropMarks.push(<div key={`hr-e-${r}`} className="crop-mark crop-mark-h" style={{ top: `${yEnd}%`, left: `${startX + gridWPct}%`, width: `${tickLenPct}%` }} />);
        }
    }
    
    // Center cross mark
    const midX = startX + gridWPct / 2;
    const midY = startY + gridHPct / 2;
    const centerTickLen = tickLenPct / 1.5;
    cropMarks.push(<div key="cv-t" className="crop-mark crop-mark-v" style={{ left: `${midX}%`, top: `${midY - centerTickLen}%`, height: `${centerTickLen}%` }} />);
    cropMarks.push(<div key="cv-b" className="crop-mark crop-mark-v" style={{ left: `${midX}%`, top: `${midY}%`, height: `${centerTickLen}%` }} />);
    cropMarks.push(<div key="ch-l" className="crop-mark crop-mark-h" style={{ top: `${midY}%`, left: `${midX - centerTickLen}%`, width: `${centerTickLen}%` }} />);
    cropMarks.push(<div key="ch-r" className="crop-mark crop-mark-h" style={{ top: `${midY}%`, left: `${midX}%`, width: `${centerTickLen}%` }} />);

    return <>{items}{cropMarks}</>;
  }

  return (
    <div className="bg-white border-2 border-dashed border-gray-300 rounded-lg p-2.5">
      <div className="w-full relative bg-gray-50 rounded-md overflow-hidden" style={{ aspectRatio }}>
        {renderVisuals()}
      </div>
    </div>
  );
};