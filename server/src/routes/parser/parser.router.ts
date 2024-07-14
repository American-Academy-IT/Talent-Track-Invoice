import express from 'express';

import { errHandler } from '../../middleware/errorMiddleware';
import { httpParseXLSX } from './parser.controller';

const parserRouter = express.Router();

parserRouter.get('/', errHandler(httpParseXLSX));

export default parserRouter;
