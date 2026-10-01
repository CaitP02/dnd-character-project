import { mkdir, rm } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { MongoMemoryServer } from 'mongodb-memory-server';

// The test database lives in one fixed folder inside node_modules/.cache rather than
// a new temp folder per run. mongod on Windows can hold its files for a while after
// stopping, which used to leave ~300 MB in TEMP per run; with a fixed path, anything
// left over is simply wiped at the start of the next run.
const DB_PATH = fileURLToPath(new URL('../../node_modules/.cache/test-mongo', import.meta.url));
const wipe = () => rm(DB_PATH, { recursive: true, force: true, maxRetries: 20, retryDelay: 250 });

export const startTestMongo = async () => {
  await wipe();
  await mkdir(DB_PATH, { recursive: true });
  const server = await MongoMemoryServer.create({ instance: { dbPath: DB_PATH } });
  return {
    uri: server.getUri(),
    stop: async () => {
      await server.stop({ doCleanup: false });
      await wipe().catch(() => {});
    },
  };
};
