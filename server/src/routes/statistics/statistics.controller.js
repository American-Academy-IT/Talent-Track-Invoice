async function httpGetLast6MonthsRevenue(_, res) {
  return res.status(501).send({ message: 'not implemented yet!' });
}

async function httpGetCustomerCount(_, res) {
  return res.status(501).send({ message: 'not implemented yet!' });
}

async function httpGetTotalIncome(_, res) {
  return res.status(501).send({ message: 'not implemented yet!' });
}

async function httpGetTotalOutcome(_, res) {
  return res.status(501).send({ message: 'not implemented yet!' });
}

async function httpGetInvoiceCount(_, res) {
  return res.status(501).send({ message: 'not implemented yet!' });
}

module.exports = {
  httpGetLast6MonthsRevenue,
  httpGetCustomerCount,
  httpGetTotalIncome,
  httpGetTotalOutcome,
  httpGetInvoiceCount,
};
