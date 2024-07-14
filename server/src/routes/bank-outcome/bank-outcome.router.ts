import express from 'express';

import { errHandler } from '../../middleware/errorMiddleware';
import {
  httpDownloadBankOutcome,
  httpExportBankOutcomePDF,
  httpExportBankOutcomeXLSX,
  httpGetBankOutcomesList,
} from './bank-outcome.controller';

const bankOutcomeRouter = express.Router();

bankOutcomeRouter.get('/', errHandler(httpGetBankOutcomesList));

bankOutcomeRouter.get('/export/pdf', errHandler(httpExportBankOutcomePDF));
bankOutcomeRouter.get('/export/xlsx', errHandler(httpExportBankOutcomeXLSX));
bankOutcomeRouter.get('/download/:serial', errHandler(httpDownloadBankOutcome));

export default bankOutcomeRouter;
