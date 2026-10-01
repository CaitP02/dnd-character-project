import { CLASSES, RACES } from '@dnd/shared';
import { Character } from '../models/Character.js';
import { HttpError } from '../middleware/errorHandler.js';

const EDITABLE_FIELDS = [
  'name', 'playerName', 'race', 'characterClass', 'level', 'background', 'alignment', 'experiencePoints',
  'abilityScores', 'savingThrows', 'skills', 'proficiencyBonus', 'passivePerception',
  'armourClass', 'initiative', 'speed', 'hitPoints', 'hitDice', 'languages', 'notes',
];

const SORTS = {
  recent: { updatedAt: -1 },
  name: { name: 1 },
  level: { level: -1, name: 1 },
};

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// "other" matches anything that isn't one of the listed options.
const listFilter = (value, options) => {
  if (value === 'other') return { $nin: options };
  return { $regex: `^${escapeRegex(value)}$`, $options: 'i' };
};

const pickFields = (body) => {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    throw new HttpError(400, 'Request body must be a JSON object');
  }
  return Object.fromEntries(EDITABLE_FIELDS.filter((key) => key in body).map((key) => [key, body[key]]));
};

const findOr404 = async (id) => {
  const character = await Character.findById(id);
  if (!character) throw new HttpError(404, 'Character not found');
  return character;
};

export const listCharacters = async (req, res) => {
  const { search, race, characterClass, sort = 'recent' } = req.query;
  const filter = {};
  if (typeof search === 'string' && search.trim()) {
    filter.name = { $regex: escapeRegex(search.trim().slice(0, 60)), $options: 'i' };
  }
  if (typeof race === 'string' && race) filter.race = listFilter(race, RACES);
  if (typeof characterClass === 'string' && characterClass) filter.characterClass = listFilter(characterClass, CLASSES);

  const characters = await Character.find(filter).sort(SORTS[sort] ?? SORTS.recent).limit(200);
  res.json({ count: characters.length, data: characters });
};

export const getCharacter = async (req, res) => {
  res.json(await findOr404(req.params.id));
};

export const createCharacter = async (req, res) => {
  const character = await Character.create(pickFields(req.body));
  res.status(201).json(character);
};

// PUT replaces the whole sheet; anything not sent goes back to blank.
export const updateCharacter = async (req, res) => {
  const character = await findOr404(req.params.id);
  // A new document fills in the blank defaults for anything the client left out.
  const blankFilled = new Character(pickFields(req.body)).toObject();
  delete blankFilled._id;
  character.overwrite({ ...blankFilled, createdAt: character.createdAt });
  await character.save();
  res.json(character);
};

export const deleteCharacter = async (req, res) => {
  const deleted = await Character.findByIdAndDelete(req.params.id);
  if (!deleted) throw new HttpError(404, 'Character not found');
  res.status(204).end();
};
