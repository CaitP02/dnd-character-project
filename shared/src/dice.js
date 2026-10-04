// Dice helpers. Every function takes an optional `rng` returning a float in
// [0, 1) so results are deterministic in tests.

export const DIE_SIZES = [4, 6, 8, 10, 12, 20, 100];

export const rollDie = (sides, rng = Math.random) => Math.floor(rng() * sides) + 1;

const NOTATION = /^\s*(\d*)\s*d\s*(\d+)\s*(?:([+-])\s*(\d+))?\s*$/i;

/** Parses dice notation such as "d20", "2d6+3" or "4d8 - 1". Returns null if invalid. */
export const parseNotation = (notation) => {
  const match = NOTATION.exec(String(notation));
  if (!match) return null;
  const count = match[1] ? Number(match[1]) : 1;
  const sides = Number(match[2]);
  const modifier = match[3] ? Number(`${match[3]}${match[4]}`) : 0;
  if (count < 1 || count > 100 || sides < 2 || sides > 1000) return null;
  return { count, sides, modifier };
};

export const roll = (notation, rng = Math.random) => {
  const parsed = typeof notation === 'string' ? parseNotation(notation) : notation;
  if (!parsed) throw new Error(`Invalid dice notation: ${notation}`);
  const rolls = Array.from({ length: parsed.count }, () => rollDie(parsed.sides, rng));
  const total = rolls.reduce((sum, r) => sum + r, 0) + parsed.modifier;
  return { ...parsed, rolls, total };
};

/**
 * A d20 test (ability check, saving throw or attack).
 * `mode` is 'normal', 'advantage' or 'disadvantage'.
 */
export const rollD20 = (modifier = 0, mode = 'normal', rng = Math.random) => {
  const rolls = mode === 'normal' ? [rollDie(20, rng)] : [rollDie(20, rng), rollDie(20, rng)];
  const kept = mode === 'advantage' ? Math.max(...rolls) : mode === 'disadvantage' ? Math.min(...rolls) : rolls[0];
  return {
    rolls,
    kept,
    modifier,
    mode,
    total: kept + modifier,
    critical: kept === 20 ? 'success' : kept === 1 ? 'failure' : null,
  };
};

export const roll4d6DropLowest = (rng = Math.random) => {
  const rolls = Array.from({ length: 4 }, () => rollDie(6, rng));
  const dropped = Math.min(...rolls);
  return { rolls, dropped, total: rolls.reduce((sum, r) => sum + r, 0) - dropped };
};

export const rollAbilityScores = (rng = Math.random) =>
  Array.from({ length: 6 }, () => roll4d6DropLowest(rng).total);
