import { useId } from 'react';
import { ABILITIES, CLASSES, RACES, SKILLS, abilityModifier, getAbility } from '@dnd/shared';
import { AbilityBox, CheckRow, LineField, NumberBox, PickOrOther } from './fields.jsx';

const bonusOf = (value) => (value === '' || value === null ? 0 : Number(value) || 0);

const TextArea = ({ label, value, onChange, rows, placeholder, className = '' }) => {
  const id = useId();
  return (
    <div className={`box flex flex-col ${className}`}>
      <label htmlFor={id} className="bar">{label}</label>
      <textarea
        id={id}
        className="lined flex-1 px-2 py-1"
        rows={rows}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};

/**
 * The paper character sheet. `set(path, value)` updates one box, e.g. set('skills.stealth', {...}).
 * `roll(label, modifier)` puts a d20 check on the dice board, ready to roll.
 */
const CharacterSheetForm = ({ sheet, set, roll, nameError }) => (
  <div className="paper rounded-sm px-4 py-6 sm:px-8">
    <div className="mb-5 flex flex-wrap items-end justify-between gap-2 border-b-4 border-double border-ink/85 pb-1">
      <p className="text-3xl leading-none sm:text-4xl" style={{ fontFamily: 'var(--font-fantasy)' }}>Character Record Sheet</p>
      <p className="label">For use with fifth edition rules</p>
    </div>

    <header className="grid gap-x-6 gap-y-3 lg:grid-cols-[1fr_2fr]">
      <div>
        <LineField
          label="Character name"
          value={sheet.name}
          onChange={(v) => set('name', v)}
          maxLength={60}
          inputClassName="text-3xl"
          aria-invalid={Boolean(nameError)}
        />
        {nameError && <p className="font-hand text-lg text-redpen" role="alert">{nameError}</p>}
      </div>
      <div className="box grid grid-cols-2 gap-x-4 gap-y-2 px-3 py-2 sm:grid-cols-4">
        <PickOrOther label="Class" options={CLASSES} value={sheet.characterClass} onChange={(v) => set('characterClass', v)} />
        <LineField label="Level" type="number" min={1} max={20} value={sheet.level} onChange={(v) => set('level', v)} />
        <LineField label="Background" value={sheet.background} maxLength={60} onChange={(v) => set('background', v)} />
        <LineField label="Player name" value={sheet.playerName} maxLength={60} onChange={(v) => set('playerName', v)} />
        <PickOrOther label="Race" options={RACES} value={sheet.race} onChange={(v) => set('race', v)} />
        <LineField label="Alignment" value={sheet.alignment} maxLength={30} onChange={(v) => set('alignment', v)} />
        <LineField
          label="Experience points"
          type="number"
          min={0}
          value={sheet.experiencePoints}
          onChange={(v) => set('experiencePoints', v)}
          className="col-span-2"
        />
      </div>
    </header>

    <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] print:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
      <section className="grid grid-cols-[7rem_minmax(0,1fr)] gap-3" aria-label="Abilities and skills">
        <div className="space-y-3">
          {ABILITIES.map((ability) => (
            <AbilityBox
              key={ability.id}
              ability={ability}
              value={sheet.abilityScores[ability.id]}
              onChange={(v) => set(`abilityScores.${ability.id}`, v)}
              onRoll={() => roll(`${ability.name} check`, abilityModifier(sheet.abilityScores[ability.id]) ?? 0)}
            />
          ))}
        </div>
        <div className="min-w-0 space-y-3">
          <NumberBox label="Proficiency bonus" value={sheet.proficiencyBonus} min={0} max={10} onChange={(v) => set('proficiencyBonus', v)} />
          <div className="box px-2 pt-2">
            <ul>
              {ABILITIES.map((ability) => (
                <CheckRow
                  key={ability.id}
                  label={ability.name}
                  bonusLabel={`${ability.name} save bonus`}
                  rollLabel={`${ability.name} save`}
                  check={sheet.savingThrows[ability.id]}
                  onChange={(v) => set(`savingThrows.${ability.id}`, v)}
                  onRoll={() => roll(`${ability.name} save`, bonusOf(sheet.savingThrows[ability.id].bonus))}
                />
              ))}
            </ul>
            <p className="label py-1 text-center">Saving throws</p>
          </div>
          <div className="box px-2 pt-2">
            <ul>
              {SKILLS.map((skill) => (
                <CheckRow
                  key={skill.id}
                  label={skill.name}
                  hint={getAbility(skill.ability).short}
                  bonusLabel={`${skill.name} bonus`}
                  check={sheet.skills[skill.id]}
                  onChange={(v) => set(`skills.${skill.id}`, v)}
                  onRoll={() => roll(skill.name, bonusOf(sheet.skills[skill.id].bonus))}
                />
              ))}
            </ul>
            <p className="label py-1 text-center">Skills</p>
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-3" aria-label="Combat and notes">
        <div className="grid grid-cols-3 gap-2">
          <NumberBox label="Armour class" value={sheet.armourClass} min={0} max={40} onChange={(v) => set('armourClass', v)} />
          <NumberBox
            label="Initiative"
            value={sheet.initiative}
            onChange={(v) => set('initiative', v)}
            onRoll={() => roll('Initiative', bonusOf(sheet.initiative))}
          />
          <NumberBox label="Speed" value={sheet.speed} min={0} max={200} onChange={(v) => set('speed', v)} />
        </div>
        <div className="box px-3 pt-2 pb-1">
          <LineField label="Hit point maximum" type="number" value={sheet.hitPoints.max} onChange={(v) => set('hitPoints.max', v)} />
          <NumberBox
            label="Current hit points"
            value={sheet.hitPoints.current}
            onChange={(v) => set('hitPoints.current', v)}
            className="mt-2 border-dashed py-3"
          />
          <div className="mt-2 grid grid-cols-2 gap-3">
            <LineField label="Temporary HP" type="number" value={sheet.hitPoints.temporary} onChange={(v) => set('hitPoints.temporary', v)} />
            <LineField label="Hit dice" value={sheet.hitDice} maxLength={20} placeholder="e.g. 5d10" onChange={(v) => set('hitDice', v)} />
          </div>
        </div>
        <NumberBox
          label="Passive wisdom (perception)"
          value={sheet.passivePerception}
          min={0}
          max={40}
          onChange={(v) => set('passivePerception', v)}
        />
        <TextArea label="Languages & other proficiencies" rows={3} value={sheet.languages} onChange={(v) => set('languages', v)} />
        <TextArea
          className="flex-1"
          label="Equipment, features & notes"
          rows={12}
          value={sheet.notes}
          placeholder="Gear, gold, features, backstory…"
          onChange={(v) => set('notes', v)}
        />
      </section>
    </div>

    <p className="label mt-6 text-center text-ink/60">Permission granted to photocopy this sheet for personal use.</p>
  </div>
);

export default CharacterSheetForm;
