// Inserts the sample characters into the database in MONGODB_URI.
// Usage: npm run seed -w backend

import mongoose from 'mongoose';
import { env } from '../src/config/env.js';
import { Character } from '../src/models/Character.js';
import { sampleCharacters } from '../src/data/sampleCharacters.js';

await mongoose.connect(env.mongoUri);
await Character.insertMany(sampleCharacters);
console.log(`Seeded ${sampleCharacters.length} sample characters.`);
await mongoose.disconnect();
