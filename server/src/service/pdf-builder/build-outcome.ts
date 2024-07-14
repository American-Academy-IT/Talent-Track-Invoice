import {
  BankOutcomeView,
  OutcomeView,
  currencyFormatter,
  dateFormatter,
} from '@invoice-system/shared';
import { join } from 'path';
import PDFDocument from 'pdfkit';

import { MARGIN_TOP, drawPaymentInfo, isEnglish, toArabic } from './helpers';

const CairoReg = join(__dirname, '..', '..', 'assets', 'Cairo-Regular.ttf');
const CairoBold = join(__dirname, '..', '..', 'assets', 'Cairo-Bold.ttf');

const drawLayout = (doc: PDFKit.PDFDocument, type: string) => {
  type = type === 'order' ? 'Expenses Order' : 'Expenses Receipt';

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
  // if (type !== 'Invoice') {
  //   doc.text(toArabic('سند قبض'), { align: 'center' });
  // }

  // move x and y after the heading
  doc.x = 25;
  doc.y = headerHeight;
  // reset font
};

const drawBillingInfo = (doc: PDFKit.PDFDocument, outcome: any) => {
  doc.y += MARGIN_TOP;
  let { serial, date, contract, description, type } = outcome;
  date = dateFormatter(date, { year: 'numeric', month: 'long', day: 'numeric' });

  doc.x = doc.page.width / 2;
  if (!isEnglish(description)) {
    description = toArabic(description);
  }

  doc.text(`${type}#: ${serial}`);
  doc.text(`Date: ${date}`);
  doc.text(`Contract: ${contract}`);
  doc.text(`Product: ${description}`);

  doc.x = 25;
};

const drawOutcomeData = (doc: PDFKit.PDFDocument, payment: any) => {
  doc.y += MARGIN_TOP;
  let { description, amount, currency } = payment;

  doc.rect(0, doc.y, doc.page.width, 25).stroke();

  doc.font(CairoBold).text('DESCRIPTION');

  if (!isEnglish(description)) description = toArabic(description);
  doc.font(CairoReg).text(description).moveUp(2);

  doc.font(CairoBold).text('TOTAL INVOICE', doc.page.width / 2);
  doc.font(CairoReg).text(currencyFormatter(amount, currency), doc.page.width / 2);

  doc.underline(0, doc.y, doc.page.width, 1, { color: '#a0aec0' });
};

const drawSignatureInfo = (doc: PDFKit.PDFDocument, recipient: string) => {
  doc.y += MARGIN_TOP;
  const columnWidth = doc.page.width / 2;

  recipient = recipient ? recipient : '';
  if (!isEnglish(recipient)) {
    recipient = toArabic(recipient);
  }

  doc.text(`Recipient: ${recipient}`);
  doc.text('Account Payable:');
  doc.moveUp(2);
  doc.text('Head of Accountant:', columnWidth);
  doc.text('Authorization:', columnWidth);
};

const buildOutcome = (outcomes: OutcomeView[]) => {
  const doc: PDFKit.PDFDocument = new PDFDocument({ size: 'A4', margin: 10 });
  doc.font(CairoReg);

  outcomes.forEach((outcome, index) => {
    const contract = outcome.prefix === 'TR' ? 'TRAINING' : 'EXAMS';

    drawLayout(doc, outcome.type);
    drawBillingInfo(doc, { contract, ...outcome });
    drawOutcomeData(doc, { contract, ...outcome });
    drawPaymentInfo(doc, outcome.method, outcome.currency);
    drawSignatureInfo(doc, outcome.recipient);
    if (index < outcomes.length - 1) doc.addPage();
  });

  return doc;
};

const buildBankOutcome = (outcomes: BankOutcomeView[]) => {
  const doc: PDFKit.PDFDocument = new PDFDocument({ size: 'A4', margin: 10 });
  doc.font(CairoReg);

  outcomes.forEach((outcome, index) => {
    const contract = outcome.prefix === 'TR' ? 'TRAINING' : 'EXAMS';

    drawLayout(doc, outcome.type);
    drawBillingInfo(doc, { contract, ...outcome });
    drawOutcomeData(doc, { contract, ...outcome });
    drawPaymentInfo(doc, outcome.method, outcome.currency);
    if (index < outcomes.length - 1) doc.addPage();
  });

  return doc;
};

export { buildOutcome, buildBankOutcome };
