import {
  ERRORS,
  ListPaymentsResponse,
  TableFilterParams,
  formatISO,
  validatePayment,
} from '@invoice-system/shared';
import { RequestHandler } from 'express';

import { getInvoiceById } from '../../datastore/models/invoice';
import {
  createPayment,
  deletePayment,
  getInvoicePayments,
  getPayment,
  listFilteredPayments,
  listPayments,
  updatePayment,
} from '../../datastore/models/payment';
import { BuildPDFPayment } from '../../service/pdf-builder/pdf-builder';
import { BuildXLSXFile } from '../../service/xlsx-parse';
import { ExpressHandlerWithParams } from '../../types';
import { PAGE_SIZE } from '../../utils/constants';

const httpGetPayment: RequestHandler = async (req, res) => {
  const paymentID = req.params.id;
  const payment = await getPayment(paymentID);

  if (!payment) {
    return res.status(404).send({ message: ERRORS.PAYMENT_NOT_FOUND });
  }

  return res.status(200).send(payment);
};

const httpDownloadPayment: RequestHandler = async (req, res) => {
  const paymentID = req.params.id;
  const payment = await getPayment(paymentID);

  if (!payment) {
    return res.status(404).send({ message: ERRORS.PAYMENT_NOT_FOUND });
  }

  const { invoiceID } = payment;
  let invoicePayments = await getInvoicePayments(invoiceID + '');

  let totalPaid = 0;
  invoicePayments = invoicePayments.map(payment => {
    totalPaid += Number(payment.paymentAmount);

    return {
      ...payment,
      totalPaid,
      previousPayments: totalPaid - Number(payment.paymentAmount),
      remainingAmount: Number(payment.invoicePrice) - totalPaid,
    };
  });

  const contract = paymentID.startsWith('TR') ? 'TRAINING' : 'EXAMS';

  const targetPayment = invoicePayments.find(payment => payment.paymentID === paymentID);
  const filePath = await BuildPDFPayment('Cash Receipt', contract, [targetPayment]);

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename=output.pdf');

  return res.sendFile(filePath);
};

const httpCreatePayment: RequestHandler = async (req, res) => {
  const { invoiceID } = req.body;

  const invoice = await getInvoiceById(invoiceID || '');
  if (!invoice) {
    return res.status(404).send({ message: ERRORS.INVOICE_NOT_FOUND });
  }

  const errMsg = validatePayment(req.body);
  if (errMsg) {
    return res.status(400).send({ message: errMsg });
  }

  const { paymentAmount } = req.body;
  const { remainingAmount } = invoice;
  if (paymentAmount > remainingAmount) {
    return res.status(400).send({
      message: 'amount must be less than or equal to remaining amount ' + remainingAmount,
    });
  }

  const payment = {
    ...req.body,
    paymentDate: formatISO(new Date(req.body.paymentDate), { representation: 'date' }),
    createdBy: res.locals.username,
  };

  const paymentID = await createPayment({ invoiceID, ...payment });
  return res.status(200).send({ paymentID: `${invoice.prefix}-${paymentID}` });
};

const httpListPayments: ExpressHandlerWithParams<
  TableFilterParams,
  null,
  ListPaymentsResponse
> = async (req, res) => {
  const { page, search, method, date } = req.query;

  const payments = await listPayments({
    page: page,
    search: search + '',
    method: method + '',
    date: date + '',
  });

  const hasNext = payments.length > PAGE_SIZE;
  const hasPrevious = req.query.page! > 1;
  hasPrevious && payments.splice(-1);

  return res.status(200).send({
    hasPrevious,
    hasNext,
    payments,
  });
};

const httpExportPaymentsPDF: RequestHandler = async (req, res) => {
  const { startDate, endDate, center, method } = req.query;
  if (!startDate || !endDate) {
    return res.status(400).send({ message: ERRORS.MISSING_REQUIRED_PARAMS });
  }

  const payments = await listFilteredPayments({
    startDate: startDate + '',
    endDate: endDate + '',
    center: center + '',
    method: method + '',
  });
  const contract = req.query?.prefix === 'TR' ? 'TRAINING' : 'EXAMS';

  const filePath = await BuildPDFPayment('Cash Receipt', contract, payments);

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename=output.pdf');

  return res.sendFile(filePath);
};

const httpExportPaymentsExcel: RequestHandler = async (req, res) => {
  const { startDate, endDate, center, method } = req.query;
  if (!startDate || !endDate) {
    return res.status(400).send({ message: ERRORS.MISSING_REQUIRED_PARAMS });
  }

  const payments = await listFilteredPayments({
    startDate: startDate + '',
    endDate: endDate + '',
    center: center + '',
    method: method + '',
  });

  const filePath = BuildXLSXFile(payments);
  res.setHeader(
    'Content-Type',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  );
  res.setHeader('Content-Disposition', 'attachment; filename=output.xlsx');

  return res.sendFile(filePath);
};

const httpUpdatePayment: RequestHandler = async (req, res) => {
  const paymentID = req.params.id;

  const payment = await getPayment(paymentID);

  if (!payment || payment.paymentID !== paymentID) {
    return res.status(404).send({ message: ERRORS.PAYMENT_NOT_FOUND });
  }

  const updated = await updatePayment({
    ...payment,
    ...req.body,
    paymentID: paymentID.split('-')[1],
  });

  return res.status(200).send({ message: updated ? 'payment updated' : 'nothing changed' });
};

const httpDeletePayment: RequestHandler = async (req, res) => {
  const paymentID = req.params.id;

  const updated = await deletePayment(paymentID.split('-')[1]);
  return res.status(200).send({ message: updated ? 'payment deleted' : 'nothing changed' });
};

export {
  httpGetPayment,
  httpDownloadPayment,
  httpCreatePayment,
  httpListPayments,
  httpExportPaymentsPDF,
  httpExportPaymentsExcel,
  httpUpdatePayment,
  httpDeletePayment,
};
