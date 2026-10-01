import { useEffect, useRef, useState } from 'react';
import { DIE_SIZES, formatModifier } from '@dnd/shared';
import DieShape from '../dice/DieShape.jsx';
import { MAX_DICE, describePool } from '../../hooks/useDiceRoller.js';

const MODES = [
  { id: 'disadvantage', label: 'Disadv.' },
  { id: 'normal', label: 'Normal' },
  { id: 'advantage', label: 'Adv.' },
];

// Stable little offsets so dice sit slightly askew on the felt.
const tilt = (seed, i) => ({
  rotate: `${((seed * 37 + i * 53) % 50) - 25}deg`,
  translate: `${((seed * 11 + i * 29) % 13) - 6}px ${((seed * 17 + i * 23) % 11) - 5}px`,
  animationDelay: `${i * 60}ms`,
});

const dieSize = (count) => (count > 8 ? 34 : count > 4 ? 42 : 54);

/** Dragging from the shelf with mouse or touch; a tap (or Enter) also adds the die. */
const useDragToBoard = (boardRef, onDrop) => {
  const [drag, setDrag] = useState(null);
  const start = useRef(null);

  const isOverBoard = (x, y) => {
    const rect = boardRef.current?.getBoundingClientRect();
    return Boolean(rect) && x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
  };

  const handlers = (sides) => ({
    onPointerDown: (e) => {
      if (e.button !== 0) return;
      e.currentTarget.setPointerCapture?.(e.pointerId);
      start.current = { sides, x: e.clientX, y: e.clientY, moved: false };
    },
    onPointerMove: (e) => {
      const s = start.current;
      if (!s) return;
      if (!s.moved && Math.hypot(e.clientX - s.x, e.clientY - s.y) < 6) return;
      s.moved = true;
      setDrag({ sides: s.sides, x: e.clientX, y: e.clientY, over: isOverBoard(e.clientX, e.clientY) });
    },
    onPointerUp: (e) => {
      const s = start.current;
      start.current = null;
      setDrag(null);
      if (s && (!s.moved || isOverBoard(e.clientX, e.clientY))) onDrop(s.sides);
    },
    onPointerCancel: () => {
      start.current = null;
      setDrag(null);
    },
    // Keyboard activation (pointer clicks are handled above)
    onClick: (e) => {
      if (e.detail === 0) onDrop(sides);
    },
  });

  return { drag, handlers };
};

const Board = ({ roller, boardRef, highlight }) => {
  const { pool, latest } = roller;
  const rolled = latest?.result;
  const dice = rolled ? rolled.dice : pool.map((sides) => ({ sides, value: '?', kept: true }));
  const size = dieSize(dice.length);

  return (
    <div
      ref={boardRef}
      className={`tray-felt flex min-h-[12rem] flex-col p-3 transition ${highlight ? 'outline-2 outline-offset-[-6px] outline-dashed outline-[#ece8dc]/70' : ''}`}
    >
      {dice.length === 0 ? (
        <p className="m-auto max-w-[13rem] text-center font-hand text-lg leading-snug text-[#e8e4d8]/75">
          Drag dice onto the felt, then press Roll.
        </p>
      ) : (
        <div key={latest?.id ?? 'pool'} className="flex flex-1 flex-wrap content-center items-center justify-center gap-1.5">
          {dice.map((die, i) => (
            rolled ? (
              <DieShape
                key={i}
                {...die}
                size={size}
                className="animate-tumble drop-shadow-[0_4px_3px_rgb(0_0_0_/_0.55)]"
                style={tilt(latest.id, i)}
              />
            ) : (
              <button
                key={i}
                type="button"
                className="cursor-pointer rounded transition hover:-translate-y-0.5 hover:opacity-80"
                onClick={() => roller.removeDie(i)}
                aria-label={`Remove d${die.sides}`}
                title="Click to take this die off"
              >
                <DieShape {...die} size={size} className="drop-shadow-[0_4px_3px_rgb(0_0_0_/_0.55)]" />
              </button>
            )
          ))}
        </div>
      )}

      {(pool.length > 0 || rolled) && (
        <div className="mt-2 flex items-end justify-between gap-2 font-hand text-[#ece8dc]" aria-live="polite">
          <div className="min-w-0">
            <p className="truncate text-lg leading-tight">{latest?.label ?? roller.label ?? describePool(pool, Number(roller.modifier) || 0)}</p>
            {rolled && (
              <p className="text-sm text-[#ece8dc]/70">
                {rolled.dice.map((d) => (d.kept ? d.value : `(${d.value})`)).join(' + ')}
                {rolled.modifier ? ` ${formatModifier(rolled.modifier)}` : ''}
              </p>
            )}
          </div>
          {rolled && <p className="text-5xl leading-none" aria-label={`Total ${rolled.total}`}>{rolled.total}</p>}
        </div>
      )}
      {rolled?.critical && (
        <p className={`text-center font-hand text-xl ${rolled.critical === 'success' ? 'text-[#f2d77a]' : 'text-[#f0a296]'}`}>
          {rolled.critical === 'success' ? 'Natural 20!' : 'Natural 1…'}
        </p>
      )}
    </div>
  );
};

const DiceTray = ({ roller }) => {
  const boardRef = useRef(null);
  const rollButtonRef = useRef(null);
  const { drag, handlers } = useDragToBoard(boardRef, roller.addDie);
  const full = roller.pool.length >= MAX_DICE;

  // When a check on the sheet sets up the board, bring the board into view and ready the Roll button.
  useEffect(() => {
    if (!roller.setupId) return;
    boardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    rollButtonRef.current?.focus({ preventScroll: true });
  }, [roller.setupId]);

  return (
    <aside className="no-print space-y-4" aria-label="Dice tray">
      <div className="tray">
        <Board roller={roller} boardRef={boardRef} highlight={drag?.over} />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <label className="paper flex items-center gap-1 rounded-sm px-2 py-1">
          <span className="label">Bonus</span>
          <input
            type="number"
            aria-label="Bonus to add to the roll"
            className="hand w-12 border-b-[1.5px] border-ink text-center"
            value={roller.modifier}
            onChange={(e) => roller.setModifier(e.target.value)}
          />
        </label>
        <div className="flex gap-2">
          <button type="button" className="btn px-3" onClick={roller.clearBoard} disabled={roller.pool.length === 0}>Clear</button>
          <button
            ref={rollButtonRef}
            type="button"
            className="btn-dark px-4 text-lg"
            onClick={roller.roll}
            disabled={roller.pool.length === 0}
          >
            Roll
          </button>
        </div>
      </div>

      <div role="radiogroup" aria-label="Roll mode for a single d20" className="mx-auto grid max-w-[15rem] grid-cols-3 gap-1">
        {MODES.map((m) => (
          <button
            key={m.id}
            type="button"
            role="radio"
            aria-checked={roller.mode === m.id}
            onClick={() => roller.setMode(m.id)}
            className={`btn px-1 py-0.5 text-sm ${roller.mode === m.id ? 'bg-ink text-paper' : ''}`}
          >
            {m.label}
          </button>
        ))}
      </div>

      <div>
        <p className="text-center text-sm text-paper/70">{full ? `The board holds ${MAX_DICE} dice` : 'Drag a die onto the felt, or tap it'}</p>
        <div className="mt-1 flex flex-wrap justify-center gap-x-1 gap-y-2">
          {DIE_SIZES.map((sides) => (
            <button
              key={sides}
              type="button"
              className="group flex cursor-grab touch-none flex-col items-center select-none active:cursor-grabbing disabled:cursor-not-allowed disabled:opacity-50"
              aria-label={`Add a d${sides} to the board`}
              disabled={full}
              {...handlers(sides)}
            >
              <DieShape
                sides={sides}
                size={46}
                className="drop-shadow-[0_3px_2px_rgb(0_0_0_/_0.6)] transition group-hover:-translate-y-1 group-hover:-rotate-6"
              />
              <span className="text-sm text-paper/80">d{sides}</span>
            </button>
          ))}
        </div>
      </div>

      {roller.history.length > 1 && (
        <div className="paper rounded-sm px-3 pt-2 pb-3">
          <div className="flex items-center justify-between">
            <h3 className="label">Earlier rolls</h3>
            <button type="button" className="label cursor-pointer hover:text-redpen" onClick={roller.clearHistory}>clear</button>
          </div>
          <ol className="mt-1 max-h-48 overflow-y-auto font-hand text-lg">
            {roller.history.slice(1).map((entry) => (
              <li key={entry.id} className="flex justify-between gap-2 border-b border-ink/20 text-pencil">
                <span className="truncate">{entry.label}</span>
                <span>{entry.result.total}</span>
              </li>
            ))}
          </ol>
        </div>
      )}

      {drag && (
        <div
          className="pointer-events-none fixed z-50"
          style={{ left: drag.x - 28, top: drag.y - 28, rotate: '-12deg', scale: '1.15' }}
          aria-hidden="true"
        >
          <DieShape sides={drag.sides} size={56} className="drop-shadow-[0_10px_8px_rgb(0_0_0_/_0.6)]" />
        </div>
      )}
    </aside>
  );
};

export default DiceTray;
