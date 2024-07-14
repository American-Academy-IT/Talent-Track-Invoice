import {
  ERRORS,
  ExportFilterParams,
  FindOrderRequest,
  FindOrdersResponse,
  ListOutcomesRequest,
  ListOutcomesResponse,
  TableFilterParams,
  validateOrder,
  validateTestCenter,
} from '@invoice-system/shared';
import { RequestHandler } from 'express';

import {
  createExamOutcome,
  createExamReceipt,
  createTrainOutcome,
  createTrainReceipt,
  deleteExamOutcome,
  deleteTrainOutcome,
  filterOutcomes,
  findOrder,
  findOrders,
  findOutcome,
  findReceipt,
  getOutcomesList,
  getRecipients,
  updateExamOutcome,
  updateTrainOutcome,
} from '../../datastore/models/outcome';
import { BuildPDFOutcome } from '../../service/pdf-builder/pdf-builder';
import { BuildXLSXFile } from '../../service/xlsx-parse';
import { ExpressHandler } from '../../types';
import { PAGE_SIZE } from '../../utils/constants';

const httpFindOrders: ExpressHandler<FindOrderRequest, FindOrdersResponse> = async (req, res) => {
  const search = req.query.search + '';

  if (!search) {
    return res.status(400).send({ message: ERRORS.MISSING_REQUIRED_PARAMS });
  }

  const orders = await findOrders(search);

  return res.status(200).send({ orders });
};

const httpGetOutcomesList: ExpressHandler<ListOutcomesRequest, ListOutcomesResponse> = async (
  req,
  res
) => {
  const filters: TableFilterParams = {
    page: req.query.page,
    search: req.query.search + '',
    method: req.query.method + '',
    date: req.query.date + '',
  };

  const outcomes = await getOutcomesList(filters);

  const hasNext = outcomes.length > PAGE_SIZE;
  const hasPrevious = filters.page > 0;
  if (hasNext) outcomes.splice(-1);

  return res.status(200).send({ hasNext, hasPrevious, outcomes });
};

const httpCreateReceipt: RequestHandler = async (req, res) => {
  const serial = req.params.serial;

  const order = await findOrder(serial);
  if (!order) {
    return res.status(404).send({ message: ERRORS.ORDER_NOT_FOUND });
  }

  const receiptExist = await findReceipt(serial);
  if (receiptExist) {
    return res.status(400).send({ message: ERRORS.DUPLICATE_RECEIPT });
  }

  const receipt = {
    ...order,
    ...req.body,
    type: 'receipt',
    createdBy: res.locals.username,
  };

  const errMsg = validateOrder(receipt);
  if (errMsg) {
    return res.status(400).send({ message: errMsg });
  }

  if (order.prefix.startsWith('EX')) {
    await createExamReceipt(receipt);
  } else {
    await createTrainReceipt(receipt);
  }

  return res.status(201).send({ message: 'Receipt added successfully' });
};

const httpCreateOutcome: RequestHandler = async (req, res) => {
  const { type, prefix, currency, date, recipient, description, amount, method } = req.body;

  if (!type || !prefix || !currency || !date || !recipient || !description || !amount || !method) {
    return res.status(404).send({ message: ERRORS.MISSING_REQUIRED_FIELDS });
  }

  const createdBy = res.locals.username;
  if (prefix === 'EX') {
    await createExamOutcome({ createdBy, ...req.body });
  } else {
    await createTrainOutcome({ createdBy, ...req.body });
  }

  return res.status(201).send({ message: 'Outcome added successfully.' });
};

const httpGetRecipients: RequestHandler = async (req, res) => {
  const name = req.query.name as string;

  const recipients = await getRecipients(name);

  return res.status(200).send({ recipients });
};

const httpDownloadOutcome: RequestHandler = async (req, res) => {
  const serial = req.params.serial;
  const type = req.query.type + '';

  if (['order', 'receipt'].includes(type) === false) {
    return res.status(400).send({ message: ERRORS.MISSING_REQUIRED_PARAMS });
  }

  const outcomePromise = type === 'order' ? findOrder(serial) : findReceipt(serial);

  const outcome = await outcomePromise;
  if (!outcome) {
    return res.status(404).send({ message: ERRORS.OUTCOME_NOT_FOUND });
  }

  const PDFfilePath = await BuildPDFOutcome([outcome]);

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename=output.pdf');

  return res.sendFile(PDFfilePath);
};

const httpExportOutcomesPdf: RequestHandler = async (req, res) => {
  const filters: ExportFilterParams = {
    startDate: req.query.startDate + '',
    endDate: req.query.endDate + '',
    center: req.query.center + '',
    method: req.query.method + '',
  };

  const outcomes = await filterOutcomes(filters);

  const PDFfilePath = await BuildPDFOutcome(outcomes);

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename=output.pdf');

  return res.sendFile(PDFfilePath);
};

const httpExportOutcomesExcel: RequestHandler = async (req, res) => {
  const filters: ExportFilterParams = {
    startDate: req.query.startDate + '',
    endDate: req.query.endDate + '',
    center: req.query.center + '',
    method: req.query.method + '',
  };

  const outcomes = await filterOutcomes(filters);

  const XLSXfilePath = BuildXLSXFile(outcomes);

  res.setHeader(
    'Content-Type',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  );
  res.setHeader('Content-Disposition', 'attachment; filename=output.xlsx');

  return res.sendFile(XLSXfilePath);
};

const httpUpdateOutcome: RequestHandler = async (req, res) => {
  const serial = req.params.serial;
  const type = req.body.type;

  const outcome = await findOutcome(serial, type);
  if (!outcome) {
    return res.status(400).send({ message: ERRORS.OUTCOME_NOT_FOUND });
  }

  const updatedOutcome = { ...outcome, ...req.body };

  let updated: boolean = false;
  if (outcome.prefix === 'EX') {
    updated = await updateExamOutcome(updatedOutcome);
  } else {
    updated = await updateTrainOutcome(updatedOutcome);
  }

  return res.status(200).send({ message: updated ? 'Outcome updated' : 'Nothing changed!' });
};

const httpDeleteOutcome: RequestHandler = async (req, res) => {
  const serial = req.params.serial;

  const [prefix, ID] = serial.split('-');

  const errMsg = validateTestCenter(prefix);
  if (errMsg) {
    return res.status(400).send({ message: errMsg });
  }

  let deleted: boolean = false;
  if (prefix === 'EX') {
    deleted = await deleteExamOutcome(ID);
  } else {
    deleted = await deleteTrainOutcome(ID);
  }

  return res
    .status(200)
    .send({ message: deleted ? 'Outcome deleted successfully' : 'Nothing changed!' });
};

export {
  httpFindOrders,
  httpGetOutcomesList,
  httpGetRecipients,
  httpCreateOutcome,
  httpCreateReceipt,
  httpDownloadOutcome,
  httpExportOutcomesPdf,
  httpExportOutcomesExcel,
  httpUpdateOutcome,
  httpDeleteOutcome,
};
