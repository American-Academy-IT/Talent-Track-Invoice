const removePaddingSpaces = obj => {
  for (const key in obj) {
    if (typeof obj[key] !== 'string') continue;
    obj[key] = obj[key].trim();
  }

  return obj;
};

function loggerMiddleware(req, _, next) {
  removePaddingSpaces(req.body);

  console.log({
    method: req.method,
    path: req.path,
    body: Object.keys(req.body).length ? req.body : undefined,
  });
  next();
}

module.exports = loggerMiddleware;
