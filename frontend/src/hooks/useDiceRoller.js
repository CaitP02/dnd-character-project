import { useCallback, useState } from 'react';
import { rollD20, rollDie } from '@dnd/shared';

const HISTORY_LENGTH = 12;
export const MAX_DICE = 20;
let nextId = 1;

/** "2d6 + d8 + 3" for the dice on the board. */
export const describePool = (pool, modifier = 0) => {
  const counts = new Map();
  pool.forEach((sides) => counts.set(sides, (counts.get(sides) ?? 0) + 1));
  const dice = [...counts].sort(([a], [b]) => b - a).map(([sides, n]) => `${n > 1 ? n : ''}d${sides}`);
  if (modifier) dice.push(modifier > 0 ? `+ ${modifier}` : `− ${Math.abs(modifier)}`);
  return dice.join(' + ').replace(/\+ ([+−])/g, '$1');
};

/**
 * Dice board state: dice are added to the board, then rolled together.
 * A single d20 respects advantage/disadvantage.
 */
export const useDiceRoller = (rng = Math.random) => {
  const [mode, setMode] = useState('normal');
  const [pool, setPool] = useState([]);
  const [modifier, setModifier] = useState(0);
  const [label, setLabel] = useState(null);
  const [latest, setLatest] = useState(null); // the roll currently shown on the board
  const [history, setHistory] = useState([]);
  const [setupId, setSetupId] = useState(0);

  const changePool = useCallback((update) => {
    setPool(update);
    setLatest(null);
    setLabel(null);
  }, []);

  const addDie = useCallback((sides) => {
    changePool((current) => (current.length >= MAX_DICE ? current : [...current, sides]));
  }, [changePool]);

  const removeDie = useCallback((index) => {
    changePool((current) => current.filter((_, i) => i !== index));
  }, [changePool]);

  const clearBoard = useCallback(() => {
    changePool([]);
    setModifier(0);
  }, [changePool]);

  /** Puts a d20 check from the sheet on the board, ready to roll. */
  const setupCheck = useCallback((checkLabel, checkModifier) => {
    setPool([20]);
    setModifier(Number(checkModifier) || 0);
    setLabel(checkLabel);
    setLatest(null);
    setSetupId((id) => id + 1);
  }, []);

  const roll = useCallback(() => {
    if (pool.length === 0) return;
    const mod = Number(modifier) || 0;
    let result;
    if (pool.length === 1 && pool[0] === 20 && mode !== 'normal') {
      const d20 = rollD20(mod, mode, rng);
      const keptIndex = d20.rolls.indexOf(d20.kept);
      result = {
        dice: d20.rolls.map((value, i) => ({ sides: 20, value, kept: i === keptIndex })),
        modifier: mod,
        total: d20.total,
        critical: d20.critical,
        mode,
      };
    } else {
      const dice = pool.map((sides) => ({ sides, value: rollDie(sides, rng), kept: true }));
      const total = dice.reduce((sum, d) => sum + d.value, 0) + mod;
      const single = pool.length === 1 && pool[0] === 20 ? dice[0].value : null;
      result = {
        dice,
        modifier: mod,
        total,
        critical: single === 20 ? 'success' : single === 1 ? 'failure' : null,
        mode: 'normal',
      };
    }
    const entry = { id: nextId++, label: label ?? describePool(pool, mod), result };
    setLatest(entry);
    setHistory((prev) => [entry, ...prev].slice(0, HISTORY_LENGTH));
  }, [pool, modifier, mode, label, rng]);

  const clearHistory = useCallback(() => setHistory([]), []);

  return {
    mode, setMode, pool, modifier, setModifier, label, latest, history, setupId,
    addDie, removeDie, clearBoard, setupCheck, roll, clearHistory,
  };
};
