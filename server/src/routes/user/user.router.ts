import express from 'express';

import { authRole } from '../../middleware/auth-middleware';
import { errHandler } from '../../middleware/errorMiddleware';
import {
  httpAddNewUser,
  httpChangePassword,
  httpDeleteUser,
  httpGetAllUsers,
  httpGetSelf,
  httpGetUser,
  httpUpdateUser,
} from './user.controller';

const usersRouter = express.Router();

usersRouter.get('/', errHandler(httpGetAllUsers));
usersRouter.get('/self', errHandler(httpGetSelf));

usersRouter.use(authRole(['admin']));

usersRouter.get('/:id', errHandler(httpGetUser));
usersRouter.post('/', errHandler(httpAddNewUser));
usersRouter.put('/:id', errHandler(httpUpdateUser));
usersRouter.put('/:id/change-password', errHandler(httpChangePassword));
usersRouter.delete('/:id', errHandler(httpDeleteUser));

export default usersRouter;
