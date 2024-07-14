import {
  CreateInvoiceRequest,
  CreateInvoiceResponse,
  ERRORS,
  FindInvoicesResponse,
  GetInvoiceRequest,
  GetInvoiceResponse,
  InvoiceTableFilterParams,
  ListInvoiceResponse,
  UpdateInvoiceRequest,
  UpdateInvoiceResponse,
  validateInvoice,
} from '@invoice-system/shared';
import { RequestHandler } from 'express';

import { getClientById } from '../../datastore/models/client';
import { findCourseByID } from '../../datastore/models/course';
import {
  createInvoice,
  deleteInvoice,
  findInvoices,
  getInvoiceById,
  listInvoices,
  updateInvoice,
} from '../../datastore/models/invoice';
import { deleteInvoicePayments, getInvoicePayments } from '../../datastore/models/payment';
import { BuildPDFInvoice } from '../../service/pdf-builder/pdf-builder';
import { ExpressHandler, ExpressHandlerWithParams } from '../../types';
import { PAGE_SIZE } from '../../utils/constants';

const httpGetInvoice: ExpressHandlerWithParams<
  { id: string },
  GetInvoiceRequest,
  GetInvoiceResponse
> = async (req, res) => {
  const id = req.params.id;

  const invoice = await getInvoiceById(+id!);
  if (!invoice) {
    return res.status(404).send({ message: ERRORS.INVOICE_NOT_FOUND });
  }

  return res.status(200).send(invoice);
};

const httpFindInvoices: ExpressHandlerWithParams<
  { search: string },
  null,
  FindInvoicesResponse
> = async (req, res) => {
  const { search } = req.query;

  if (search === undefined) {
    return res.status(404).send({ message: ERRORS.MISSING_REQUIRED_PARAMS });
  }

  const invoices = await findInvoices(search);
  return res.status(200).send({ invoices });
};

const httpListInvoices: ExpressHandlerWithParams<
  InvoiceTableFilterParams,
  null,
  ListInvoiceResponse
> = async (req, res, next) => {
  const { search, date, page, center } = req.query;

  if (date !== undefined || page !== undefined || center !== undefined) {
    const invoices = await listInvoices({
      search,
      date,
      page,
      center,
    });

    const hasNext = invoices.length > PAGE_SIZE;
    const hasPrevious = req.query.page > 0;
    if (hasNext) invoices.splice(-1);

    return res.status(200).send({ hasNext, hasPrevious, invoices });
  }

  next();
};

const httpGetInvoicePayments: RequestHandler = async (req, res) => {
  const invoiceID = req.params.id;
  return res.status(200).send(await getInvoicePayments(invoiceID));
};

const httpDownloadInvoice: RequestHandler = async (req, res) => {
  const invoiceID = req.params.id.split('-')[1] ?? req.params.id;
  const invoice = await getInvoiceById(+invoiceID);

  if (!invoice) {
    return res.status(404).send({ message: 'Invoice not found!' });
  }

  const contract = invoice.prefix === 'TR' ? 'TRAINING' : 'EXAMS';

  const PDFfilePath = await BuildPDFInvoice('Invoice', contract, [invoice]);

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename=${invoice.invoiceID}.pdf`);

  return res.sendFile(PDFfilePath);
};

const httpCreateInvoice: ExpressHandler<CreateInvoiceRequest, CreateInvoiceResponse> = async (
  req,
  res
) => {
  const { clientID, courseID, prefix, invoiceDate, coursePrice } = req.body;

  if (!clientID || !courseID || !prefix || !invoiceDate) {
    return res.status(400).send({ message: ERRORS.MISSING_REQUIRED_FIELDS });
  }

  const course = await findCourseByID(courseID);
  if (!course) {
    return res.status(400).send({ message: ERRORS.COURSE_NOT_FOUND });
  }

  const { courseName } = course;
  const isSOW = courseName.startsWith('SOW');

  if (isSOW && !coursePrice) {
    return res.status(400).send({ message: 'You should provide a valid price for SOW courses!' });
  }

  const client = await getClientById(clientID);
  if (!client) {
    return res.status(400).send({ message: ERRORS.CLIENT_NOT_FOUND });
  }

  const discount = req.body.discount ?? 0;
  let invoicePrice = course.coursePrice - course.coursePrice * (discount / 100);
  if (isSOW) {
    invoicePrice = coursePrice! - coursePrice! * (discount / 100);
  }

  const invoice: CreateInvoiceRequest = {
    clientID,
    courseID,
    prefix,
    discount,
    invoiceDate,
    invoicePrice,
    coursePrice: isSOW ? coursePrice : course.coursePrice,
  };

  const invoiceID = await createInvoice(invoice);
  return res.status(201).send(await getInvoiceById(invoiceID));
};

const httpUpdateInvoice: ExpressHandlerWithParams<
  { id: string },
  UpdateInvoiceRequest,
  UpdateInvoiceResponse
> = async (req, res) => {
  const invoiceID = parseInt(req.params.id + '');
  const { clientID, courseID, prefix, invoiceDate, coursePrice } = req.body;

  if (!clientID || !courseID || !prefix || !invoiceDate) {
    return res.status(400).send({ message: ERRORS.MISSING_REQUIRED_FIELDS });
  }

  const invoice = await getInvoiceById(invoiceID!);
  if (!invoice) {
    return res.status(404).send({ message: ERRORS.INVOICE_NOT_FOUND });
  }

  const course = await findCourseByID(courseID);
  const { courseName } = course;

  const isSOW = courseName.startsWith('SOW');
  if (isSOW && !coursePrice) {
    return res.status(400).send({ message: ERRORS.INVALID_SOW_PRICE });
  }

  const client = await getClientById(clientID);
  if (!client) {
    return res.status(400).send({ message: ERRORS.CLIENT_NOT_FOUND });
  }

  await updateInvoice({ ...invoice, ...req.body, invoiceID });
  return res.status(200).send({ message: 'Invoice updated successfully' });
};

const httpDeleteInvoice: RequestHandler = async (req, res) => {
  const invoiceId: string = req.params.id;

  const deleted = await deleteInvoice(invoiceId);

  if (!deleted) {
    return res.status(404).send({ message: ERRORS.INVOICE_NOT_FOUND });
  }

  const deletedPaymentsCount = await deleteInvoicePayments(invoiceId);
  return res.status(200).send({ message: `Invoice deleted with ${deletedPaymentsCount} payments` });
};

export {
  httpGetInvoice,
  httpFindInvoices,
  httpListInvoices,
  httpDownloadInvoice,
  httpCreateInvoice,
  httpUpdateInvoice,
  httpDeleteInvoice,
  httpGetInvoicePayments,
};
