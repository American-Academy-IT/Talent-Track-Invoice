import express from 'express';

import { errHandler } from '../../middleware/errorMiddleware';
import {
  httpCreateInvoice,
  httpDeleteInvoice,
  httpDownloadInvoice,
  httpFindInvoices,
  httpGetInvoice,
  httpGetInvoicePayments,
  httpListInvoices,
  httpUpdateInvoice,
} from './invoice.controller';

const invoiceRouter = express.Router();

invoiceRouter.get('/', errHandler(httpListInvoices), errHandler(httpFindInvoices));
invoiceRouter.get('/:id', errHandler(httpGetInvoice));
invoiceRouter.post('/', errHandler(httpCreateInvoice));
invoiceRouter.put('/:id', errHandler(httpUpdateInvoice));
invoiceRouter.delete('/:id', errHandler(httpDeleteInvoice));
invoiceRouter.get('/download/:id', errHandler(httpDownloadInvoice));
invoiceRouter.get('/:id/payments', errHandler(httpGetInvoicePayments));

export default invoiceRouter;
