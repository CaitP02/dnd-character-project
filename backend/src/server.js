import mongoose from 'mongoose';
import { env } from './config/env.js';
import { createApp } from './app.js';

const start = async () => {
  let memoryDb = null;
  let uri = env.mongoUri;

  if (uri === 'memory') {
    const { startMemoryDb, seedDatabase } = await import('./config/memoryDb.js');
    memoryDb = await startMemoryDb();
    uri = memoryDb.uri;
    await mongoose.connect(uri);
    await seedDatabase();
    console.log('Using an in-memory MongoDB (data resets on restart)');
  } else {
    await mongoose.connect(uri);
    console.log('Connected to MongoDB');
  }

  const server = createApp().listen(env.port, () => {
    console.log(`API listening on http://localhost:${env.port}`);
  });

  const shutdown = async () => {
    server.close();
    await mongoose.disconnect();
    await memoryDb?.stop();
    process.exit(0);
  };
  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
};

start().catch((err) => {
  console.error('Failed to start API:', err.message);
  process.exit(1);
});
