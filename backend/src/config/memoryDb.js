// Zero-setup development database: an in-memory MongoDB seeded with sample
// characters. Enabled with MONGODB_URI=memory. Data is lost when the API stops.

import { rm } from 'node:fs/promises';
import { Character } from '../models/Character.js';
import { sampleCharacters } from '../data/sampleCharacters.js';

export const startMemoryDb = async () => {
  // Imported lazily because mongodb-memory-server is a dev dependency.
  const { MongoMemoryServer } = await import('mongodb-memory-server');
  const server = await MongoMemoryServer.create();
  const { dbPath } = server.instanceInfo;
  return {
    uri: server.getUri('dnd'),
    stop: async () => {
      await server.stop({ doCleanup: false });
      // Delete the data folder ourselves; the built-in cleanup can fail on Windows.
      await rm(dbPath, { recursive: true, force: true, maxRetries: 20, retryDelay: 250 });
    },
  };
};

export const seedDatabase = async () => {
  await Character.insertMany(sampleCharacters);
  console.log(`Seeded ${sampleCharacters.length} sample characters`);
};
