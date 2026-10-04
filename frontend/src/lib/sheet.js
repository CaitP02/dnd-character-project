import { ABILITY_IDS, SKILL_IDS } from '@dnd/shared';

// The form keeps every box as a string (what's written on the paper); the API
// stores numbers, with null for a blank box.

const blankChecks = (keys) => Object.fromEntries(keys.map((key) => [key, { proficient: false, bonus: '' }]));

export const emptySheet = () => ({
  name: '',
  playerName: '',
  race: '',
  characterClass: '',
  level: '',
  background: '',
  alignment: '',
  experiencePoints: '',
  abilityScores: Object.fromEntries(ABILITY_IDS.map((id) => [id, ''])),
  savingThrows: blankChecks(ABILITY_IDS),
  skills: blankChecks(SKILL_IDS),
  proficiencyBonus: '',
  passivePerception: '',
  armourClass: '',
  initiative: '',
  speed: '',
  hitPoints: { max: '', current: '', temporary: '' },
  hitDice: '',
  languages: '',
  notes: '',
});

const toText = (value) => (value === null || value === undefined ? '' : String(value));

const toNumber = (value) => {
  const text = String(value ?? '').trim();
  if (text === '') return null;
  const number = Number(text);
  return Number.isFinite(number) ? number : null;
};

const checksFromCharacter = (keys, saved = {}) =>
  Object.fromEntries(keys.map((key) => [key, {
    proficient: Boolean(saved[key]?.proficient),
    bonus: toText(saved[key]?.bonus),
  }]));

export const sheetFromCharacter = (character) => {
  const blank = emptySheet();
  const plain = Object.fromEntries(
    Object.keys(blank)
      .filter((key) => typeof blank[key] === 'string')
      .map((key) => [key, toText(character[key])]),
  );
  return {
    ...plain,
    abilityScores: Object.fromEntries(ABILITY_IDS.map((id) => [id, toText(character.abilityScores?.[id])])),
    savingThrows: checksFromCharacter(ABILITY_IDS, character.savingThrows),
    skills: checksFromCharacter(SKILL_IDS, character.skills),
    hitPoints: {
      max: toText(character.hitPoints?.max),
      current: toText(character.hitPoints?.current),
      temporary: toText(character.hitPoints?.temporary),
    },
  };
};

const NUMBER_FIELDS = ['level', 'experiencePoints', 'proficiencyBonus', 'passivePerception', 'armourClass', 'initiative', 'speed'];

const checksToPayload = (checks) =>
  Object.fromEntries(Object.entries(checks).map(([key, check]) => [key, {
    proficient: check.proficient,
    bonus: toNumber(check.bonus),
  }]));

export const toPayload = (sheet) => ({
  ...Object.fromEntries(Object.entries(sheet).filter(([, value]) => typeof value === 'string').map(([key, value]) => [
    key,
    NUMBER_FIELDS.includes(key) ? toNumber(value) : value.trim(),
  ])),
  abilityScores: Object.fromEntries(Object.entries(sheet.abilityScores).map(([id, value]) => [id, toNumber(value)])),
  savingThrows: checksToPayload(sheet.savingThrows),
  skills: checksToPayload(sheet.skills),
  hitPoints: Object.fromEntries(Object.entries(sheet.hitPoints).map(([key, value]) => [key, toNumber(value)])),
});

/** Immutably sets a value at a dotted path, e.g. setIn(sheet, 'skills.stealth.bonus', '4'). */
export const setIn = (object, path, value) => {
  const [head, ...rest] = path.split('.');
  if (rest.length === 0) return { ...object, [head]: value };
  return { ...object, [head]: setIn(object[head], rest.join('.'), value) };
};
