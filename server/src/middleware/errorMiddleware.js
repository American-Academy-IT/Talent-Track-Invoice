function errHandler(fn) {
  return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
}

function errMiddleware(err, _, res, __) {
  console.log('Uncaught exception:', err);

  res.status(500).send({
    message: 'Oops, an unexpected error occurred, please try again.',
  });
}

module.exports = { errHandler, errMiddleware };
