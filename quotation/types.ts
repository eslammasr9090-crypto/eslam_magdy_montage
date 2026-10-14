
export interface InvoiceItem {
  id: string;
  description: string;
  size: string;
  quantity: number;
  unitPrice: number;
}

export interface InvoiceDetails {
  date: string;
  invoiceNumber: string;
  customerName: string;
  logo?: string;
  stamp?: string;
  taxNumber?: string;
  commercialRegistrationNumber?: string;
}

export interface SavedQuotation {
  id: string;
  timestamp: number;
  items: InvoiceItem[];
  details: InvoiceDetails;
}

export const PREDEFINED_ITEMS = [
  "بنر (Banner)",
  "استيكر (Sticker)",
  "طباعة يوفي (UV Printing)",
  "كروت شخصية (Business Cards)",
  "ختم (Stamp)",
  "سند قبض",
  "سند صرف",
  "بوب أب (Pop-up)",
  "رول أب (Roll-up)",
  "فواتير كمبيوتر (Computer Invoice)",
  "بروشور (Brochure)",
  "فلاير (Flyer)"
];

export const PREDEFINED_SIZES = [
  "A4", "A3", "A5", "A2", "A1", "A0", "B4", "B5", "DL", "9 X 5.5 (Business Card)", "14 X 22", "100 X 70", "50 X 70", "35 X 50"
];
