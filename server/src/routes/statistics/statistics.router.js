const express = require('express');
const {
  httpGetLast6MonthsRevenue,
  httpGetCustomerCount,
  httpGetTotalIncome,
  httpGetTotalOutcome,
  httpGetInvoiceCount,
} = require('./statistics.controller');
const { errHandler } = require('../../middleware/errorMiddleware');

const statisticsRouter = express.Router();

statisticsRouter.get('/6months-revenue', errHandler(httpGetLast6MonthsRevenue));
statisticsRouter.get('/customer-count', errHandler(httpGetCustomerCount));
statisticsRouter.get('/invoice-count', errHandler(httpGetInvoiceCount));
statisticsRouter.get('/total-outcome', errHandler(httpGetTotalOutcome));
statisticsRouter.get('/total-income', errHandler(httpGetTotalIncome));

module.exports = statisticsRouter;
