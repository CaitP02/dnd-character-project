import 'dotenv/config';

const required = (name) => {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable ${name}. Copy backend/.env.example to backend/.env and fill it in.`);
  }
  return value;
};

export const env = {
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: Number(process.env.PORT ?? 5555),
  // Comma-separated list of allowed browser origins, e.g. "http://localhost:5173,https://my-app.vercel.app"
  corsOrigins: (process.env.CORS_ORIGIN ?? 'http://localhost:5173')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean),
  // Number of proxies in front of the API (Vercel + Render in production), so
  // the rate limiter sees the visitor's IP rather than the proxy's.
  trustProxy: Number(process.env.TRUST_PROXY ?? 0),
  // Creates, edits and deletes allowed per visitor every 15 minutes
  writeLimit: Number(process.env.WRITE_RATE_LIMIT ?? 60),
  get mongoUri() {
    return required('MONGODB_URI');
  },
};
