import express from 'express';

import { errHandler } from '../../middleware/errorMiddleware';
import {
  httpCreatePayment,
  httpDeletePayment,
  httpDownloadPayment,
  httpExportPaymentsExcel,
  httpExportPaymentsPDF,
  httpGetPayment,
  httpListPayments,
  httpUpdatePayment,
} from './payment.controller';

const paymentRouter = express.Router();

paymentRouter.get('/', errHandler(httpListPayments));
paymentRouter.get('/:id', errHandler(httpGetPayment));
paymentRouter.post('/', errHandler(httpCreatePayment));
paymentRouter.put('/:id', errHandler(httpUpdatePayment));
paymentRouter.delete('/:id', errHandler(httpDeletePayment));

paymentRouter.get('/export/pdf', errHandler(httpExportPaymentsPDF));
paymentRouter.get('/export/xlsx', errHandler(httpExportPaymentsExcel));
paymentRouter.get('/download/:id', errHandler(httpDownloadPayment));

export default paymentRouter;
