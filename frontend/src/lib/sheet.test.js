import { describe, expect, it } from 'vitest';
import { emptySheet, setIn, sheetFromCharacter, toPayload } from './sheet.js';

describe('sheet conversion', () => {
  it('turns blank boxes into nulls and trims text', () => {
    const payload = toPayload({ ...emptySheet(), name: '  Pip  ', level: '' });
    expect(payload.name).toBe('Pip');
    expect(payload.level).toBeNull();
    expect(payload.abilityScores.str).toBeNull();
    expect(payload.skills.stealth).toEqual({ proficient: false, bonus: null });
    expect(payload.hitPoints).toEqual({ max: null, current: null, temporary: null });
  });

  it('parses numbers written in the boxes, including negatives', () => {
    let sheet = emptySheet();
    sheet = setIn(sheet, 'level', '5');
    sheet = setIn(sheet, 'abilityScores.dex', '14');
    sheet = setIn(sheet, 'skills.stealth.bonus', '-1');
    sheet = setIn(sheet, 'skills.stealth.proficient', true);
    sheet = setIn(sheet, 'hitPoints.current', '0');
    const payload = toPayload(sheet);
    expect(payload.level).toBe(5);
    expect(payload.abilityScores.dex).toBe(14);
    expect(payload.skills.stealth).toEqual({ proficient: true, bonus: -1 });
    expect(payload.hitPoints.current).toBe(0);
  });

  it('round-trips a saved character', () => {
    const saved = {
      _id: 'abc',
      name: 'Marrow',
      race: 'Tabaxi',
      level: 2,
      abilityScores: { str: 10, dex: 15 },
      skills: { arcana: { proficient: true, bonus: 5 } },
      hitPoints: { max: 17, current: null },
      notes: 'Goggles',
    };
    const sheet = sheetFromCharacter(saved);
    expect(sheet).not.toHaveProperty('_id');
    expect(sheet.level).toBe('2');
    expect(sheet.abilityScores.int).toBe('');
    expect(sheet.hitPoints.current).toBe('');
    const payload = toPayload(sheet);
    expect(payload).toMatchObject({ name: 'Marrow', race: 'Tabaxi', level: 2, notes: 'Goggles' });
    expect(payload.skills.arcana).toEqual({ proficient: true, bonus: 5 });
  });

  it('setIn does not mutate the original', () => {
    const sheet = emptySheet();
    const next = setIn(sheet, 'savingThrows.con.proficient', true);
    expect(sheet.savingThrows.con.proficient).toBe(false);
    expect(next.savingThrows.con.proficient).toBe(true);
  });
});
