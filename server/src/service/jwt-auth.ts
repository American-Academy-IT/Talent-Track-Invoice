import jwt from 'jsonwebtoken';

import { JwtObject } from '../types';

const getJwtSecret = (): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    console.log('Missing JWT Secret');
    process.exit(1);
  }

  return secret;
};

const signJwt = (obj: JwtObject) => {
  return jwt.sign(obj, getJwtSecret(), { expiresIn: '7d' });
};

// throws on bad token
const verifyJwt = (token: string): JwtObject => {
  return jwt.verify(token, getJwtSecret()) as JwtObject;
};

export { signJwt, verifyJwt };
