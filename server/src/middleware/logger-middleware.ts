import { NextFunction, Request, Response } from 'express';

const removePaddingSpaces = (obj: any) => {
  for (const key in obj) {
    if (typeof obj[key] !== 'string') continue;
    obj[key] = obj[key].trim();
  }

  return obj;
};

function loggerMiddleware(req: Request, _res: Response, next: NextFunction) {
  removePaddingSpaces(req.body);

  console.log({
    method: req.method,
    path: req.path,
    body: Object.keys(req.body).length ? req.body : undefined,
  });
  next();
}

export default loggerMiddleware;
