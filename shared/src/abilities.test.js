import { describe, expect, it } from 'vitest';
import { abilityModifier, formatModifier } from './abilities.js';

describe('abilityModifier', () => {
  it.each([[1, -5], [8, -1], [9, -1], [10, 0], [11, 0], [12, 1], [15, 2], [20, 5], [30, 10]])(
    'score %i gives %i', (score, mod) => expect(abilityModifier(score)).toBe(mod),
  );

  it('is blank for a blank score', () => {
    expect(abilityModifier(null)).toBeNull();
    expect(abilityModifier('')).toBeNull();
    expect(abilityModifier(undefined)).toBeNull();
  });
});

describe('formatModifier', () => {
  it('uses a real minus sign and leaves blanks empty', () => {
    expect(formatModifier(3)).toBe('+3');
    expect(formatModifier(0)).toBe('+0');
    expect(formatModifier(-2)).toBe('−2');
    expect(formatModifier(null)).toBe('');
  });
});
