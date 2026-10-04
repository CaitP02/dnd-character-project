import { describe, expect, it } from 'vitest';
import { parseNotation, roll, roll4d6DropLowest, rollD20, rollDie } from './dice.js';

// Returns the given d-values in order for a die of `sides` faces.
const fixedRng = (sides, values) => {
  let i = 0;
  return () => (values[i++ % values.length] - 0.5) / sides;
};

describe('dice', () => {
  it('rolls within the die range', () => {
    expect(rollDie(20, () => 0)).toBe(1);
    expect(rollDie(20, () => 0.9999)).toBe(20);
  });

  it.each([
    ['d20', { count: 1, sides: 20, modifier: 0 }],
    ['2d6+3', { count: 2, sides: 6, modifier: 3 }],
    [' 4D8 - 1 ', { count: 4, sides: 8, modifier: -1 }],
  ])('parses %s', (notation, expected) => expect(parseNotation(notation)).toEqual(expected));

  it.each(['', 'banana', '0d6', 'd1', '101d6', '2d6+'])('rejects %j', (notation) => {
    expect(parseNotation(notation)).toBeNull();
  });

  it('totals dice and modifier', () => {
    expect(roll('2d6+3', fixedRng(6, [4, 5]))).toMatchObject({ rolls: [4, 5], total: 12 });
    expect(() => roll('nope')).toThrow(/Invalid dice notation/);
  });

  it('keeps the higher die with advantage and the lower with disadvantage', () => {
    expect(rollD20(2, 'advantage', fixedRng(20, [7, 15]))).toMatchObject({ rolls: [7, 15], kept: 15, total: 17 });
    expect(rollD20(2, 'disadvantage', fixedRng(20, [7, 15]))).toMatchObject({ kept: 7, total: 9 });
  });

  it('flags natural 20s and 1s', () => {
    expect(rollD20(0, 'normal', fixedRng(20, [20])).critical).toBe('success');
    expect(rollD20(0, 'normal', fixedRng(20, [1])).critical).toBe('failure');
    expect(rollD20(0, 'normal', fixedRng(20, [10])).critical).toBeNull();
  });

  it('drops the lowest of 4d6', () => {
    expect(roll4d6DropLowest(fixedRng(6, [6, 1, 4, 3]))).toEqual({ rolls: [6, 1, 4, 3], dropped: 1, total: 13 });
  });
});
