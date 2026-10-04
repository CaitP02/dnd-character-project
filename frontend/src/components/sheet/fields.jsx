import { useId, useState } from 'react';
import { GiDiceTwentyFacesTwenty } from 'react-icons/gi';
import { abilityModifier, formatModifier } from '@dnd/shared';

const OTHER = '__other__';

export const RollButton = ({ label, onRoll }) => (
  <button type="button" className="roll-btn no-print" onClick={onRoll} aria-label={`Put ${label} on the dice board`} title={`Put ${label} on the dice board`}>
    <GiDiceTwentyFacesTwenty aria-hidden="true" />
  </button>
);

/** Text written on a line, with the printed label underneath. */
export const LineField = ({ label, value, onChange, className = '', inputClassName = '', ...props }) => {
  const id = useId();
  return (
    <div className={className}>
      <input id={id} className={`line ${inputClassName}`} value={value} onChange={(e) => onChange(e.target.value)} {...props} />
      <label htmlFor={id} className="label mt-0.5">{label}</label>
    </div>
  );
};

/** A list to pick from, plus "Other" for writing your own. */
export const PickOrOther = ({ label, options, value, onChange, className = '' }) => {
  const id = useId();
  const [otherMode, setOtherMode] = useState(value !== '' && !options.includes(value));

  const handleSelect = (next) => {
    if (next === OTHER) {
      setOtherMode(true);
      onChange('');
    } else {
      setOtherMode(false);
      onChange(next);
    }
  };

  return (
    <div className={className}>
      <div className="flex items-end border-b-[1.5px] border-ink">
        {otherMode ? (
          <>
            <input
              id={id}
              className="hand min-w-0 px-1"
              value={value}
              maxLength={40}
              placeholder="write it in"
              autoFocus
              onChange={(e) => onChange(e.target.value)}
            />
            <button
              type="button"
              className="no-print shrink-0 cursor-pointer px-1 text-xs tracking-wider text-ink/60 uppercase hover:text-ink"
              onClick={() => handleSelect('')}
            >
              list
            </button>
          </>
        ) : (
          <select id={id} className="hand px-1" value={value} onChange={(e) => handleSelect(e.target.value)}>
            <option value="">&nbsp;</option>
            {options.map((option) => <option key={option} value={option}>{option}</option>)}
            <option value={OTHER}>Other…</option>
          </select>
        )}
      </div>
      <label htmlFor={id} className="label mt-0.5">{label}{otherMode ? ' (other)' : ''}</label>
    </div>
  );
};

/** A boxed number, e.g. Armour Class. */
export const NumberBox = ({ label, value, onChange, onRoll, min, max, className = '' }) => {
  const id = useId();
  return (
    <div className={`box flex flex-col items-center px-2 pt-1.5 pb-1 ${className}`}>
      <div className="flex w-full items-center">
        <input
          id={id}
          type="number"
          inputMode="numeric"
          min={min}
          max={max}
          className="hand text-center text-3xl"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        {onRoll && <RollButton label={label} onRoll={onRoll} />}
      </div>
      <label htmlFor={id} className="label text-center">{label}</label>
    </div>
  );
};

/** Ability score box: the player writes the score, the modifier is worked out. */
export const AbilityBox = ({ ability, value, onChange, onRoll }) => {
  const id = useId();
  const modifier = abilityModifier(value);
  return (
    <div className="box flex flex-col items-center overflow-hidden">
      <label htmlFor={id} className="bar w-full text-[0.8rem] tracking-normal">{ability.name}</label>
      <input
        id={id}
        type="number"
        inputMode="numeric"
        min={1}
        max={30}
        aria-label={`${ability.name} score`}
        className="hand py-1 text-center text-4xl"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="—"
      />
      <div className="mb-2 flex items-center gap-1">
        <span
          className="flex h-7 min-w-12 items-center justify-center rounded-full border-[1.5px] border-ink px-2 font-hand text-xl text-pencil"
          aria-label={`${ability.name} modifier`}
        >
          {formatModifier(modifier)}
        </span>
        <RollButton label={`${ability.name} check`} onRoll={onRoll} />
      </div>
    </div>
  );
};

/** One saving throw or skill: proficiency bubble, bonus written on a line, name. */
export const CheckRow = ({ label, hint, bonusLabel, rollLabel = label, check, onChange, onRoll }) => {
  const id = useId();
  return (
    <li className="flex items-center gap-2 py-0.5">
      <input
        type="checkbox"
        className="bubble"
        checked={check.proficient}
        aria-label={`${label} proficient`}
        onChange={(e) => onChange({ ...check, proficient: e.target.checked })}
      />
      <input
        id={id}
        type="number"
        inputMode="numeric"
        className="hand w-10 border-b-[1.5px] border-ink text-center text-lg"
        aria-label={bonusLabel}
        value={check.bonus}
        onChange={(e) => onChange({ ...check, bonus: e.target.value })}
      />
      <label htmlFor={id} className="min-w-0 flex-1 truncate text-sm">
        {label}{hint && <span className="ml-1 text-[0.65rem] tracking-wider text-ink/60 uppercase">{hint}</span>}
      </label>
      <RollButton label={rollLabel} onRoll={onRoll} />
    </li>
  );
};
