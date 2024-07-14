import { join } from 'path';

const MARGIN_TOP = 15;

const isEnglish = (word: string) => {
  const ENGLISH_RegEx = /[a-zA-Z]+$/i;
  return ENGLISH_RegEx.test(word);
};

const toArabic = (word: string) => {
  const wordArr = word.split(' ');
  wordArr.reverse();

  const newWord = wordArr.join('  ');
  return newWord;
};

const getIBAN = (method: string, currency: string) => {
  if (method === 'WIO') {
    if (currency === 'AED') {
      return 'EG630010015000000100045941347';
    } else {
      return 'EG350010015000000100045941366';
    }
  } else {
    if (currency === 'USD') {
      return 'EG45003701932031807890429';
    } else {
      return 'EG45003701932031819745575';
    }
  }
};

const drawLayout = (doc: PDFKit.PDFDocument, type: string) => {
  if (type !== 'Invoice') {
    type = type === 'order' ? 'Cash Order' : 'Cash Receipt';
  }
  const pageWidth = doc.page.width;
  const pageHeight = doc.page.height;
  const logoPath = join(__dirname, '..', '..', 'assets', 'Talentlogo.png');
  const CairoReg = join(__dirname, '..', '..', 'assets', 'Cairo-Regular.ttf');
  const CairoBold = join(__dirname, '..', '..', 'assets', 'Cairo-Bold.ttf');

  const fillHeight = 10;
  const headerHeight = 160;
  const columnWidth = pageWidth / 2;

  doc.rect(0, 0, pageWidth, headerHeight).fill('#edf2f7');
  doc.rect(0, 0, pageWidth, fillHeight).fill('blue'); // top
  doc.rect(0, pageHeight - 10, pageWidth, fillHeight).fill('blue'); // bottom

  doc.font(CairoBold).fontSize(14).fill('black').text('Talent Track Dubai');
  doc.image(logoPath, doc.x + 15, doc.y, { width: 120 });
  doc.fontSize(24).text(type, columnWidth, headerHeight / 2, { align: 'center' });
  doc.font(CairoReg).fontSize(12);
  if (type !== 'Invoice') {
    doc.text(toArabic('سند قبض'), { align: 'center' });
  }

  // move x and y after the heading
  doc.x = 25;
  doc.y = headerHeight;
  // reset font
};

const getBankName = (method: string) => {
  switch (method) {
    case 'WIO':
      return 'WIO';
    default:
      return '';
  }
};

const getBankAccountName = (method: string) => {
  switch (method) {
    case 'WIO':
      return 'Talent Track FOR TRAINING';
    default:
      return '';
  }
};

const getSwiftCode = (method: string) => {
  switch (method) {
    case 'Wio':
      return 'CIBEEGXXXX';
    default:
      return '';
  }
};

const drawBankInfo = (doc: PDFKit.PDFDocument, paymentMethod: string, currency: string) => {
  const columnWidth = doc.page.width / 2;

  const bankName = getBankName(paymentMethod);
  const bankAccName = getBankAccountName(paymentMethod);

  doc.text(`Bank Account Name: ${bankAccName}`, { width: columnWidth });
  doc.text(`Swift Code: ${getSwiftCode(paymentMethod)}`, {
    width: columnWidth,
  });
  doc.text(`Bank Name: ${bankName}`, { width: columnWidth });
  doc.text(`IBAN: ${getIBAN(paymentMethod, currency)}`, { width: columnWidth });
};

const drawPaymentInfo = (doc: PDFKit.PDFDocument, method: string, currency: string) => {
  doc.x = 25; // reset
  doc.y += MARGIN_TOP;

  doc.text(`Payment Method: ${method === 'CASH' ? 'CASH PAYMENT' : 'BANK TRANSFER'}`);
  if (method !== 'CASH') drawBankInfo(doc, method, currency);
  doc.text('Remit Address: Dubai UAE');
};

export { MARGIN_TOP, isEnglish, toArabic, getIBAN, drawLayout, drawBankInfo, drawPaymentInfo };
