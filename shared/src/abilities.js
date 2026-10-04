export const ABILITIES = [
  { id: 'str', name: 'Strength', short: 'STR' },
  { id: 'dex', name: 'Dexterity', short: 'DEX' },
  { id: 'con', name: 'Constitution', short: 'CON' },
  { id: 'int', name: 'Intelligence', short: 'INT' },
  { id: 'wis', name: 'Wisdom', short: 'WIS' },
  { id: 'cha', name: 'Charisma', short: 'CHA' },
];

export const ABILITY_IDS = ABILITIES.map((a) => a.id);

export const getAbility = (id) => ABILITIES.find((a) => a.id === id) ?? null;

export const SKILLS = [
  { id: 'acrobatics', name: 'Acrobatics', ability: 'dex' },
  { id: 'animalHandling', name: 'Animal Handling', ability: 'wis' },
  { id: 'arcana', name: 'Arcana', ability: 'int' },
  { id: 'athletics', name: 'Athletics', ability: 'str' },
  { id: 'deception', name: 'Deception', ability: 'cha' },
  { id: 'history', name: 'History', ability: 'int' },
  { id: 'insight', name: 'Insight', ability: 'wis' },
  { id: 'intimidation', name: 'Intimidation', ability: 'cha' },
  { id: 'investigation', name: 'Investigation', ability: 'int' },
  { id: 'medicine', name: 'Medicine', ability: 'wis' },
  { id: 'nature', name: 'Nature', ability: 'int' },
  { id: 'perception', name: 'Perception', ability: 'wis' },
  { id: 'performance', name: 'Performance', ability: 'cha' },
  { id: 'persuasion', name: 'Persuasion', ability: 'cha' },
  { id: 'religion', name: 'Religion', ability: 'int' },
  { id: 'sleightOfHand', name: 'Sleight of Hand', ability: 'dex' },
  { id: 'stealth', name: 'Stealth', ability: 'dex' },
  { id: 'survival', name: 'Survival', ability: 'wis' },
];

export const SKILL_IDS = SKILLS.map((s) => s.id);

export const getSkill = (id) => SKILLS.find((s) => s.id === id) ?? null;

export const ALIGNMENTS = [
  'Lawful Good', 'Neutral Good', 'Chaotic Good',
  'Lawful Neutral', 'True Neutral', 'Chaotic Neutral',
  'Lawful Evil', 'Neutral Evil', 'Chaotic Evil',
];

// Race and class names offered in the pickers (SRD 5.1). Anything else is entered as "Other".
export const RACES = ['Dragonborn', 'Dwarf', 'Elf', 'Gnome', 'Half-Elf', 'Half-Orc', 'Halfling', 'Human', 'Tiefling'];

export const CLASSES = [
  'Barbarian', 'Bard', 'Cleric', 'Druid', 'Fighter', 'Monk',
  'Paladin', 'Ranger', 'Rogue', 'Sorcerer', 'Warlock', 'Wizard',
];

/** Modifier for an ability score, or null for a blank score. */
export const abilityModifier = (score) =>
  score === null || score === undefined || score === '' || Number.isNaN(Number(score))
    ? null
    : Math.floor((Number(score) - 10) / 2);

export const formatModifier = (value) =>
  value === null || value === undefined ? '' : value >= 0 ? `+${value}` : `−${Math.abs(value)}`;
