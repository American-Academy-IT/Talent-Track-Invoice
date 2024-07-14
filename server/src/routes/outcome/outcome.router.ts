import express from 'express';

import { errHandler } from '../../middleware/errorMiddleware';
import {
  httpCreateOutcome,
  httpCreateReceipt,
  httpDeleteOutcome,
  httpDownloadOutcome,
  httpExportOutcomesExcel,
  httpExportOutcomesPdf,
  httpFindOrders,
  httpGetOutcomesList,
  httpGetRecipients,
  httpUpdateOutcome,
} from './outcome.controller';

const outcomeRouter = express.Router();

outcomeRouter.get('/', errHandler(httpGetOutcomesList));
outcomeRouter.get('/orders', errHandler(httpFindOrders));

outcomeRouter.post('/', errHandler(httpCreateOutcome));
outcomeRouter.post('/:serial', errHandler(httpCreateReceipt));
outcomeRouter.put('/:serial', errHandler(httpUpdateOutcome));
outcomeRouter.delete('/:serial', errHandler(httpDeleteOutcome));

outcomeRouter.get('/recipients', errHandler(httpGetRecipients));

outcomeRouter.get('/export/pdf', errHandler(httpExportOutcomesPdf));
outcomeRouter.get('/export/xlsx', errHandler(httpExportOutcomesExcel));
outcomeRouter.get('/download/:serial', errHandler(httpDownloadOutcome));

export default outcomeRouter;
