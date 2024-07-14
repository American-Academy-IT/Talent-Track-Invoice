import { ERRORS } from '@invoice-system/shared';
import { RequestHandler } from 'express';
import { TokenExpiredError, VerifyErrors } from 'jsonwebtoken';

import { getUserByUsername } from '../datastore/models/user';
import { verifyJwt } from '../service/jwt-auth';
import { JwtObject } from '../types';

const authUser: RequestHandler = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      throw ERRORS.TOKEN_NOT_FOUND;
    }

    const payload: JwtObject = verifyJwt(token);
    const user = await getUserByUsername(payload.username);

    res.locals.branch = user.branch;
    res.locals.username = user.username;
  } catch (e) {
    const verifyErr = e as VerifyErrors;
    if (verifyErr instanceof TokenExpiredError) {
      return res.status(401).send({ message: ERRORS.TOKEN_EXPIRED });
    }
    return res.status(401).send({ message: ERRORS.BAD_TOKEN });
  }

  return next();
};

function authRole(roles: string | string[]): RequestHandler {
  return async (req, res, next) => {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) {
        throw ERRORS.BAD_TOKEN;
      }

      const payload = verifyJwt(token);

      const user = await getUserByUsername(payload.username);

      if (!user || !roles.includes(user.role)) {
        throw 'unauthorized user';
      }

      return next();
    } catch (err) {
      return res.status(403).send({ message: err });
    }
  };
}

export { authUser, authRole };
