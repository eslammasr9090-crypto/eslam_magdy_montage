import { bestFit, smallPerBig100x70 } from './calculatorService';
import type { BookletResult } from '../types';

const ceilDiv = (a: number, b: number): number => b > 0 ? Math.ceil(a / b) : 0;
const formatEn = (num: number) => num.toLocaleString('en-US');

export const calculateBooklet = (
    sheetW: number, sheetH: number,
    pageW: number, pageH: number,
    pages: number, quantity: number, margin: number,
    gutter: number,
    hasCover: boolean
): BookletResult => {

    const spreadW = 2 * pageW;
    const spreadH = pageH;

    const fit = bestFit(sheetW, sheetH, spreadW, spreadH, margin, gutter);
    const spreadsPerFace = fit.total;
    const pagesPerSheet = 4 * spreadsPerFace;

    const coverPages = hasCover ? 4 : 0;
    const innerPages = Math.max(pages - coverPages, 0);

    const coverSheets = ceilDiv(quantity * coverPages, pagesPerSheet);
    const innerSheets = ceilDiv(quantity * innerPages, pagesPerSheet);
    const totalSheets = coverSheets + innerSheets;
    
    const perBig = smallPerBig100x70(sheetW, sheetH);
    const coverBigSheets = ceilDiv(coverSheets, perBig);
    const innerBigSheets = ceilDiv(innerSheets, perBig);
    const totalBigSheets = coverBigSheets + innerBigSheets;

    // Maoun: 100 sheets for heavy (cover), 250 for light (inner)
    const coverMaoun = hasCover ? ceilDiv(coverBigSheets, 100) : 0;
    const innerMaoun = ceilDiv(innerBigSheets, 250);
    const totalMaoun = coverMaoun + innerMaoun;

    const info = hasCover
        ? `غلاف: <b>${formatEn(4)}</b> صفحات — داخلي: <b>${formatEn(innerPages)}</b> صفحة`
        : `بدون غلاف — داخلي: <b>${formatEn(innerPages)}</b> صفحة`;

    return {
        fit,
        spreadsPerFace,
        pagesPerSheet,
        info,
        coverSheets,
        innerSheets,
        totalSheets,
        coverBigSheets,
        innerBigSheets,
        totalBigSheets,
        coverMaoun,
        innerMaoun,
        totalMaoun,
        perBig,
    };
};