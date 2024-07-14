import express from 'express';

import { authUser } from '../middleware/auth-middleware';
import { errHandler } from '../middleware/errorMiddleware';
import { loginHandler } from './auth-handler';
import bankOutcomeRouter from './bank-outcome/bank-outcome.router';
import clientRouter from './client/client.router';
import courseRouter from './course/course.router';
import invoiceRouter from './invoice/invoice.router';
import outcomeRouter from './outcome/outcome.router';
import parserRouter from './parser/parser.router';
import paymentRouter from './payment/payment.router';
import statisticsRouter from './statistics/statistics.router';
import usersRouter from './user/user.router';

const api = express.Router();

api.get('/healthz', (_, res) => res.send({ status: '🤞' }));
api.post('/login', errHandler(loginHandler));

api.use(authUser);

api.use('/parse', parserRouter);
api.use('/users', usersRouter);
api.use('/clients', clientRouter);
api.use('/courses', courseRouter);
api.use('/invoices', invoiceRouter);
api.use('/payments', paymentRouter);
api.use('/statistics', statisticsRouter);

api.use('/outcomes', outcomeRouter);
api.use('/outcomes/bank', bankOutcomeRouter);

export default api;
