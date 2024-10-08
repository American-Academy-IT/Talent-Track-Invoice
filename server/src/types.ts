import { RequestHandler } from 'express';

export interface JwtObject {
  username: string;
  role: string;
  branch: string;
}

// Create generic type and append error prop to the Type T
type WithError<T> = T & { message: string };

export type ExpressHandler<Req, Res> = RequestHandler<
  string,
  Partial<WithError<Res>>,
  Partial<Req>,
  any
>;

export type ExpressHandlerWithParams<Params, Req, Res> = RequestHandler<
  Partial<Params>,
  Partial<WithError<Res>>,
  Partial<Req>,
  any
>;
