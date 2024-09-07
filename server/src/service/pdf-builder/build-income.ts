import { currencyFormatter, dateFormatter } from '@invoice-system/shared';
import { join } from 'path';
import PDFDocument from 'pdfkit';

import { MARGIN_TOP, drawLayout, drawPaymentInfo, isEnglish, toArabic } from './helpers';

const CairoReg = join(__dirname, '..', '..', 'assets', 'Cairo-Regular.ttf');
const CairoBold = join(__dirname, '..', '..', 'assets', 'Cairo-Bold.ttf');

const drawBillingInfo = (doc: PDFKit.PDFDocument, payment: any) => {
  const curY = doc.y + MARGIN_TOP;
  const columnWidth = doc.page.width / 2;

  let { invoiceID, paymentID, clientName, paymentDate, invoiceDate, contract, courseName, type } =
    payment;
  let date = null;
  if (type === 'Invoice') {
    date = dateFormatter(invoiceDate, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } else {
    date = dateFormatter(paymentDate, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  if (!isEnglish(clientName)) clientName = toArabic(clientName);

  doc.y = curY;
  doc.text(`Bill To: ${clientName}`, { width: columnWidth - 25 });

  doc.x = doc.page.width / 2;
  doc.y = curY;

  if (type === 'Invoice') {
    doc.text(`Invoice#: ${invoiceID}`);
  } else {
    doc.text(`Invoice#: ${invoiceID}`);
    doc.text(`Payment#: ${paymentID}`);
  }
  doc.text(`Date: ${date}`);
  doc.text(`Contract: ${contract}`);
  doc.text(`Product: ${courseName}`);

  doc.x = 25;
};

const drawInvoiceTotal = (doc: PDFKit.PDFDocument, invoice: any) => {
  doc.y += MARGIN_TOP;
  let { courseName, invoicePrice, currency } = invoice;

  doc.rect(0, doc.y, doc.page.width, 25).stroke();

  doc.font(CairoBold).text('DESCRIPTION');

  if (!isEnglish(courseName)) courseName = toArabic(courseName);
  doc.font(CairoReg).text(courseName).moveUp(2);

  doc.font(CairoBold).text('INVOICE TOTAL', doc.page.width / 2);
  doc.font(CairoReg).text(currencyFormatter(invoicePrice, currency), doc.page.width / 2);

  doc.underline(0, doc.y, doc.page.width, 1, { color: '#a0aec0' });
};

const drawPaymentDetails = (doc: PDFKit.PDFDocument, payment: any) => {
  doc.y += MARGIN_TOP;
  let {
    discount,
    currency,
    totalPaid,
    courseName,
    coursePrice,
    invoicePrice,
    paymentAmount,
    previousPayments,
  } = payment;

  doc.rect(0, doc.y, doc.page.width, 25).stroke();

  doc.font(CairoBold).text('DESCRIPTION');

  if (!isEnglish(courseName)) courseName = toArabic(courseName);
  doc.font(CairoReg).text(courseName).moveUp(2);

  doc.font(CairoBold);
  doc.text('INVOICE DETAILS', doc.page.width / 2);
  doc.font(CairoReg);

  doc.text(`Course Price: ${currencyFormatter(coursePrice, currency)}`);
  doc.text(`Discount: ${discount}%`);
  doc.text(`Invoice Price: ${currencyFormatter(invoicePrice, currency)}`);

  doc.font(CairoBold);
  doc.text(`Current Payment: ${currencyFormatter(paymentAmount, currency)}`);
  doc.font(CairoReg);

  if (previousPayments !== undefined) {
    doc.text(`Previous Payments: ${currencyFormatter(previousPayments, currency)}`);
  }
  doc.text(`Total Paid: ${currencyFormatter(totalPaid, currency)}`);
  doc.text(`Remaining Amount: ${currencyFormatter(invoicePrice - totalPaid, currency)}`);
  doc.underline(0, doc.y, doc.page.width, 1, { color: '#a0aec0' });
};

const drawRefundPolicy = (doc: PDFKit.PDFDocument, contract: string) => {
  doc.x = 25; // reset
  doc.y += MARGIN_TOP;
  doc.text(toArabic('سياسة الاسترداد:'), { align: 'right' });

  if (contract === 'EXAMS') {
    const rule =
      'جميع رسوم التوثيق و الاختبارات غير قابله للاسترداد بعد توقيع العميل على هذا المستند.';

    doc.text(toArabic(rule), { align: 'right' });
  } else {
    const rule1 = '1.قبل بداية الخدمه التعليميه يسترد 75% من قيمه المصروفات';
    const rule2 =
      '2.بعد نهاية الأسبوع الأول من الدراسة/الخدمه التعليميه يسترد 60% من قيمه المصروفات';
    const rule3 = '3.بعد الأسبوع الأول لا يسترد أي مبلغ';
    const rule4 =
      '4.جديه الحجز بجميع الدورات او الخدمات التعليميه لا ترد في حاله اتمام الدوره او الخدمه';

    doc.text(toArabic(rule1), { align: 'right' });
    doc.text(toArabic(rule2), { align: 'right' });
    doc.text(toArabic(rule3), { align: 'right' });
    doc.text(toArabic(rule4), { align: 'right' });
  }
};

const drawSignature = (doc: PDFKit.PDFDocument) => {
  doc.y += MARGIN_TOP;
  const columnWidth = doc.page.width / 2;

  doc.text(toArabic('توقيع العميل:'), { width: columnWidth, align: 'right' });
  doc.moveUp();
  doc.text(toArabic('توقيع الموظف:'), columnWidth, doc.y, { align: 'right' });
};

const buildInvoice = (type: string, contract: string, invoices: any[]): PDFKit.PDFDocument => {
  const doc: PDFKit.PDFDocument = new PDFDocument({ size: 'A4', margin: 10 });
  doc.font(CairoReg);

  invoices.forEach((invoice, index: number) => {
    const withType = { ...invoice, contract, type };
    drawLayout(doc, type);
    drawBillingInfo(doc, withType);
    drawInvoiceTotal(doc, withType);
    // drawPaymentInfo(doc, invoice.paymentMethod, invoice.currency);
    drawRefundPolicy(doc, contract);

    if (index < invoices.length - 1) doc.addPage();
  });

  return doc;
};

const buildPayment = (type: string, contract: string, payments: any[]): PDFKit.PDFDocument => {
  const doc: PDFKit.PDFDocument = new PDFDocument({ size: 'A4', margin: 10 });
  doc.font(CairoReg);

  payments.forEach((payment, index: number) => {
    const withType = { ...payment, contract, type };
    drawLayout(doc, type);
    drawBillingInfo(doc, withType);
    drawPaymentDetails(doc, payment);
    drawPaymentInfo(doc, payment.paymentMethod, payment.currency);
    drawRefundPolicy(doc, contract);
    drawSignature(doc);
    if (index < payments.length - 1) doc.addPage();
  });

  return doc;
};

export { buildInvoice, buildPayment };
