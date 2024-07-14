import { NextFunction, Request, Response } from 'express';

function errHandler(fn: any) {
  return (req: any, res: any, next: any) => Promise.resolve(fn(req, res, next)).catch(next);
}

function errMiddleware(err: Error, _req: Request, res: Response, _next: NextFunction) {
  console.log('Uncaught exception:', err);

  return res.status(500).send({
    message: 'Oops, an unexpected error occurred, please try again.',
  });
}

export { errHandler, errMiddleware };
