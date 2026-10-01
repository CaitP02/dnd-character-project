import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import mongoose from 'mongoose';
import request from 'supertest';
import { startTestMongo } from './helpers/memoryMongo.js';
import { createApp } from '../src/app.js';
import { Character } from '../src/models/Character.js';
import { sampleCharacters } from '../src/data/sampleCharacters.js';

let mongo;
const app = createApp();
const api = () => request(app);

const sheet = (overrides = {}) => ({
  name: 'Brenna Stonefist',
  race: 'Dwarf',
  characterClass: 'Fighter',
  level: 5,
  abilityScores: { str: 16, dex: 13, con: 16, int: 8, wis: 13, cha: 10 },
  skills: { athletics: { proficient: true, bonus: 6 } },
  hitPoints: { max: 49, current: 40 },
  notes: 'Chain mail, shield.',
  ...overrides,
});

beforeAll(async () => {
  mongo = await startTestMongo();
  await mongoose.connect(mongo.uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongo?.stop();
});

beforeEach(async () => {
  await Character.deleteMany({});
});

describe('GET /api/health', () => {
  it('reports ok', async () => {
    const res = await api().get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: 'ok' });
  });
});

describe('character CRUD', () => {
  it('creates, reads, updates and deletes a character', async () => {
    const created = await api().post('/api/characters').send(sheet());
    expect(created.status).toBe(201);
    expect(created.body).toMatchObject({ name: 'Brenna Stonefist', level: 5, race: 'Dwarf' });
    const id = created.body._id;

    const fetched = await api().get(`/api/characters/${id}`);
    expect(fetched.status).toBe(200);
    expect(fetched.body.skills.athletics).toEqual({ proficient: true, bonus: 6 });

    const updated = await api().put(`/api/characters/${id}`).send(sheet({ level: 6 }));
    expect(updated.status).toBe(200);
    expect(updated.body.level).toBe(6);
    expect(updated.body.createdAt).toBe(created.body.createdAt);

    expect((await api().delete(`/api/characters/${id}`)).status).toBe(204);
    expect((await api().get(`/api/characters/${id}`)).status).toBe(404);
  });

  it('only needs a name; every other box can stay blank', async () => {
    const res = await api().post('/api/characters').send({ name: 'Nameless' });
    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({ race: '', level: null, armourClass: null });
    expect(res.body.abilityScores.str).toBeNull();
    expect(res.body.skills.stealth).toEqual({ proficient: false, bonus: null });
  });

  it('accepts any race and class text (the "Other" option)', async () => {
    const res = await api().post('/api/characters').send(sheet({ race: 'Tabaxi', characterClass: 'Blood Hunter' }));
    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({ race: 'Tabaxi', characterClass: 'Blood Hunter' });
  });

  it('clears fields that are left out of an update', async () => {
    const { body } = await api().post('/api/characters').send(sheet());
    const res = await api().put(`/api/characters/${body._id}`).send({ name: 'Brenna' });
    expect(res.body.notes).toBe('');
    expect(res.body.hitPoints.max).toBeNull();
  });

  it('ignores fields that are not part of the sheet', async () => {
    const res = await api().post('/api/characters').send(sheet({ spells: ['Fireball'], isAdmin: true }));
    expect(res.status).toBe(201);
    expect(res.body).not.toHaveProperty('spells');
    expect(res.body).not.toHaveProperty('isAdmin');
  });
});

describe('errors', () => {
  const missingId = new mongoose.Types.ObjectId().toString();

  it.each(['get', 'put', 'delete'])('%s on a missing character returns 404', async (method) => {
    const res = await api()[method](`/api/characters/${missingId}`).send(sheet());
    expect(res.status).toBe(404);
    expect(res.body.error.message).toBe('Character not found');
  });

  it.each(['get', 'put', 'delete'])('%s with a malformed id returns 400', async (method) => {
    const res = await api()[method]('/api/characters/not-an-id').send(sheet());
    expect(res.status).toBe(400);
  });

  it('requires a name and rejects out-of-range or fractional numbers', async () => {
    const res = await api().post('/api/characters').send(sheet({ name: '', level: 25, armourClass: 12.5 }));
    expect(res.status).toBe(400);
    expect(res.body.error.details.map((d) => d.path)).toEqual(expect.arrayContaining(['name', 'level', 'armourClass']));
  });

  it('rejects non-numeric values in number boxes', async () => {
    const res = await api().post('/api/characters').send(sheet({ abilityScores: { str: 'strong' } }));
    expect(res.status).toBe(400);
  });

  it('rejects malformed JSON', async () => {
    const res = await api().post('/api/characters').set('Content-Type', 'application/json').send('{"name":');
    expect(res.status).toBe(400);
    expect(res.body.error.message).toBe('Malformed JSON body');
  });

  it('returns 404 JSON for unknown routes', async () => {
    expect((await api().get('/api/nope')).status).toBe(404);
  });
});

describe('listing', () => {
  beforeEach(async () => {
    await Character.insertMany(sampleCharacters);
  });

  it('lists all characters with a count', async () => {
    const res = await api().get('/api/characters');
    expect(res.body.count).toBe(sampleCharacters.length);
  });

  it('searches by name case-insensitively and treats regex characters literally', async () => {
    expect((await api().get('/api/characters?search=ILYRA')).body.count).toBe(1);
    expect((await api().get('/api/characters?search=.*')).body.count).toBe(0);
  });

  it('filters by race and class, including "other"', async () => {
    expect((await api().get('/api/characters?race=elf')).body.data[0].name).toBe('Ilyra Moonwhisper');
    expect((await api().get('/api/characters?characterClass=Rogue')).body.count).toBe(1);
    const other = await api().get('/api/characters?race=other');
    expect(other.body.data.map((c) => c.name)).toEqual(['Marrow']);
  });

  it('sorts by level', async () => {
    const res = await api().get('/api/characters?sort=level');
    expect(res.body.data.map((c) => c.level)).toEqual([7, 5, 3, 2]);
  });
});
