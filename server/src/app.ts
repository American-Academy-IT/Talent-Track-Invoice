import cors from 'cors';
import express from 'express';
import path from 'path';

import { errMiddleware } from './middleware/errorMiddleware';
import loggerMiddleware from './middleware/loggerMiddleware';
import api from './routes/api';

const app = express();

app.use(
  cors({
    origin: ['*', 'http://localhost:3000'],
  })
);
app.use(express.json());
app.use(loggerMiddleware);
app.use(express.static(path.join(__dirname, '..', 'public')));

app.use('/api/v1', api);

app.get('/*', (_, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

app.use(errMiddleware);

export default app;
