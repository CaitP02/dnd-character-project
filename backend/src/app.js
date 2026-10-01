import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { env } from './config/env.js';
import characterRoutes from './routes/characters.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';

export const createApp = () => {
  const app = express();

  app.use(helmet());
  app.use(cors({ origin: env.corsOrigins }));
  app.use(express.json({ limit: '100kb' }));
  if (env.nodeEnv === 'development') app.use(morgan('dev'));

  app.get('/api/health', (req, res) => res.json({ status: 'ok' }));
  app.use('/api/characters', characterRoutes);

  app.use(notFound);
  app.use(errorHandler);

  return app;
};
