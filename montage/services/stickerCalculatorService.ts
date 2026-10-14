import { bestFit } from './calculatorService';
import type { StickerResult } from '../types';

export function calculateSticker(
    sheetW: number,
    sheetH: number,
    itemW: number,
    itemH: number,
    margin: number,
    gutter: number,
    quantity: number,
    type: 'rect' | 'circle'
): StickerResult {
    if (type === 'rect') {
        const fit = bestFit(sheetW, sheetH, itemW, itemH, margin, gutter);
        const sheetsNeeded = fit.total > 0 ? Math.ceil(quantity / fit.total) : 0;
        return {
            total: fit.total,
            sheetsNeeded,
            rows: fit.rows,
            cols: fit.cols,
            orient: fit.orient,
            leftW: fit.leftW,
            leftH: fit.leftH,
            type: 'rect'
        };
    } else {
        // Circle calculation (Grid packing for now, diameter = itemW)
        const d = itemW;
        const fit = bestFit(sheetW, sheetH, d, d, margin, gutter);
        const sheetsNeeded = fit.total > 0 ? Math.ceil(quantity / fit.total) : 0;
        return {
            total: fit.total,
            sheetsNeeded,
            rows: fit.rows,
            cols: fit.cols,
            type: 'circle'
        };
    }
}
