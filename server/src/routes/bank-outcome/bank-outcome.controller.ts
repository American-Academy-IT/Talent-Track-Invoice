import { ERRORS, ExportFilterParams, TableFilterParams } from '@invoice-system/shared';
import { RequestHandler } from 'express';

import {
  filterBankOutcomes,
  getBankOutcome,
  getBankOutcomesList,
} from '../../datastore/models/bank-outcome';
import { BuildPDFBankOutcome } from '../../service/pdf-builder/pdf-builder';
import { BuildXLSXFile } from '../../service/xlsx-parse';
import { PAGE_SIZE } from '../../utils/constants';

const httpGetBankOutcomesList: RequestHandler = async (req, res) => {
  const { page, search, method, date } = req.query;

  if (page === undefined || search === undefined || date === undefined || method === undefined) {
    return res.status(400).send({ message: ERRORS.MISSING_REQUIRED_PARAMS });
  }

  const filters: TableFilterParams = {
    page: parseInt(page + ''),
    search: search + '',
    method: method + '',
    date: date + '',
  };

  const outcomes = await getBankOutcomesList(filters);

  const hasNext = outcomes.length > PAGE_SIZE;
  const hasPrevious = filters.page > 0;
  if (hasNext) outcomes.splice(-1);

  return res.status(200).send({ hasNext, hasPrevious, outcomes });
};

const httpDownloadBankOutcome: RequestHandler = async (req, res) => {
  const { serial } = req.params;

  const outcome = await getBankOutcome(serial);
  if (!outcome) {
    return res.status(404).send({ message: ERRORS.OUTCOME_NOT_FOUND });
  }

  const PDFfilePath = await BuildPDFBankOutcome([outcome]);

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename=output.pdf');

  return res.sendFile(PDFfilePath);
};

const httpExportBankOutcomePDF: RequestHandler = async (req, res) => {
  const { center, method, startDate, endDate } = req.query;

  if (
    center === undefined ||
    method === undefined ||
    startDate === undefined ||
    endDate === undefined
  ) {
    return res.status(400).send({ message: ERRORS.MISSING_REQUIRED_PARAMS });
  }

  const filters: ExportFilterParams = {
    center: center + '',
    method: method + '',
    startDate: startDate + '',
    endDate: endDate + '',
  };

  const outcomes = await filterBankOutcomes(filters);

  const PDFfilePath = await BuildPDFBankOutcome(outcomes);

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename=output.pdf');

  return res.sendFile(PDFfilePath);
};

const httpExportBankOutcomeXLSX: RequestHandler = async (req, res) => {
  const { center, method, startDate, endDate } = req.query;

  if (
    center === undefined ||
    method === undefined ||
    startDate === undefined ||
    endDate === undefined
  ) {
    return res.status(400).send({ message: ERRORS.MISSING_REQUIRED_PARAMS });
  }

  const filters: ExportFilterParams = {
    center: center + '',
    method: method + '',
    startDate: startDate + '',
    endDate: endDate + '',
  };

  const outcomes = await filterBankOutcomes(filters);
  const XLSXfile = BuildXLSXFile(outcomes);

  res.setHeader(
    'Content-Type',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  );
  res.setHeader('Content-Disposition', 'attachment; filename=output.xlsx');

  return res.sendFile(XLSXfile);
};

export {
  httpGetBankOutcomesList,
  httpExportBankOutcomePDF,
  httpDownloadBankOutcome,
  httpExportBankOutcomeXLSX,
};
