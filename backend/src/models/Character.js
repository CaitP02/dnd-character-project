import mongoose from 'mongoose';
import { ABILITY_IDS, SKILL_IDS } from '@dnd/shared';

const { Schema } = mongoose;

// Every number on the sheet may be left blank (null), like an unfilled box on paper.
const number = (min, max) => ({
  type: Number,
  min,
  max,
  default: null,
  validate: { validator: (v) => v === null || Number.isInteger(v), message: '{PATH} must be a whole number' },
});
const text = (maxlength) => ({ type: String, trim: true, maxlength, default: '' });

const checkSchema = new Schema(
  { proficient: { type: Boolean, default: false }, bonus: number(-20, 30) },
  { _id: false },
);

const byKey = (keys, schema) => new Schema(
  Object.fromEntries(keys.map((key) => [key, { type: schema, default: () => ({}) }])),
  { _id: false },
);

const characterSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 60 },
    playerName: text(60),
    race: text(40),
    characterClass: text(40),
    level: number(1, 20),
    background: text(60),
    alignment: text(30),
    experiencePoints: number(0, 10_000_000),

    abilityScores: {
      type: new Schema(Object.fromEntries(ABILITY_IDS.map((id) => [id, number(1, 30)])), { _id: false }),
      default: () => ({}),
    },
    savingThrows: { type: byKey(ABILITY_IDS, checkSchema), default: () => ({}) },
    skills: { type: byKey(SKILL_IDS, checkSchema), default: () => ({}) },
    proficiencyBonus: number(0, 10),
    passivePerception: number(0, 40),

    armourClass: number(0, 40),
    initiative: number(-10, 20),
    speed: number(0, 200),
    hitPoints: {
      type: new Schema({ max: number(0, 999), current: number(-999, 999), temporary: number(0, 999) }, { _id: false }),
      default: () => ({}),
    },
    hitDice: text(20),

    languages: text(500),
    notes: text(5000),
  },
  { timestamps: true, versionKey: false },
);

characterSchema.index({ updatedAt: -1 });
characterSchema.index({ name: 1 });

export const Character = mongoose.model('Character', characterSchema);
