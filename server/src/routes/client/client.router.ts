import express from 'express';

import { errHandler } from '../../middleware/errorMiddleware';
import {
  httpCreateClient,
  httpDeleteClient,
  httpGetClientById,
  httpListClients,
  httpUpdateClient,
} from './client.controller';

const clientRouter = express.Router();

clientRouter.get('/', errHandler(httpListClients));
clientRouter.post('/', errHandler(httpCreateClient));
clientRouter.put('/:id', errHandler(httpUpdateClient));
clientRouter.get('/:id', errHandler(httpGetClientById));
clientRouter.delete('/:id', errHandler(httpDeleteClient));

export default clientRouter;
