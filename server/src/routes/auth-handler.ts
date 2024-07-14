import { RequestHandler } from 'express';

import { getUserByUsername } from '../datastore/models/user';
import encryptPassword from '../service/encryptPassword';
import { signJwt } from '../service/jwt-auth';

const loginHandler: RequestHandler = async (req, res) => {
  const loggedUser = req.body;
  const user = await getUserByUsername(loggedUser.username);

  const hashedPassword = encryptPassword(loggedUser.password);
  if (!user || user.password !== hashedPassword) {
    return res.status(400).send({ message: 'Invalid username or password' });
  }

  const token: string = signJwt({
    username: user.username,
    role: user.role,
    branch: user.branch,
  });

  return res.status(200).send({ accessToken: token });
};

export { loginHandler };
