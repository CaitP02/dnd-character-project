import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CLASSES, RACES } from '@dnd/shared';
import { listCharacters } from '../api/characters.js';
import { useApi, useDebounced, useSlow } from '../hooks/useApi.js';
import { EmptyState, ErrorState, Loading } from '../components/ui/States.jsx';

const SORTS = [
  { value: 'recent', label: 'Last updated' },
  { value: 'name', label: 'Name' },
  { value: 'level', label: 'Level' },
];

const summary = (c) => [c.level && `Level ${c.level}`, c.race, c.characterClass].filter(Boolean).join(' ') || 'Blank sheet';

const Stat = ({ label, value }) => (
  <span>
    <span className="text-xs tracking-widest uppercase">{label}</span>{' '}
    <span className="text-xl">{value ?? '—'}</span>
  </span>
);

const IndexCard = ({ character }) => (
  <Link to={`/characters/${character._id}`} className="index-card">
    <h2 className="truncate text-3xl leading-[34px] font-semibold">{character.name}</h2>
    <p className="mt-2 truncate text-xl leading-[27px]">{summary(character)}</p>
    <p className="flex gap-5 leading-[27px]">
      <Stat label="HP" value={character.hitPoints?.max} />
      <Stat label="AC" value={character.armourClass} />
      {character.playerName && <span className="truncate text-lg text-pencil/70">played by {character.playerName}</span>}
    </p>
  </Link>
);

const Filter = ({ label, value, onChange, children }) => (
  <label className="flex flex-col">
    <span className="label">{label}</span>
    <select className="hand border-b-[1.5px] border-ink px-1" value={value} onChange={(e) => onChange(e.target.value)}>
      {children}
    </select>
  </label>
);

const CharacterList = () => {
  // Filters are kept in the URL so a filtered view survives a refresh.
  const [params, setParams] = useSearchParams();
  const [search, setSearch] = useState(params.get('search') ?? '');
  const race = params.get('race') ?? '';
  const characterClass = params.get('class') ?? '';
  const sort = params.get('sort') ?? 'recent';
  const debouncedSearch = useDebounced(search);

  const { data, loading, error, retry } = useApi(
    (signal) => listCharacters({ search: debouncedSearch || undefined, race: race || undefined, characterClass: characterClass || undefined, sort }, signal),
    [debouncedSearch, race, characterClass, sort],
  );
  const slow = useSlow(loading);

  const setParam = (key, value) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    setParams(next, { replace: true });
  };

  const characters = data?.data ?? [];
  const filtered = Boolean(debouncedSearch || race || characterClass);

  return (
    <div className="space-y-8">
      <section aria-label="Search and filter" className="paper grid gap-4 rounded-sm px-5 py-4 sm:grid-cols-[2fr_1fr_1fr_1fr]">
        <label className="flex flex-col">
          <span className="label">Search by name</span>
          <input
            type="search"
            className="hand border-b-[1.5px] border-ink px-1"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setParam('search', e.target.value);
            }}
          />
        </label>
        <Filter label="Race" value={race} onChange={(v) => setParam('race', v)}>
          <option value="">Any</option>
          {RACES.map((r) => <option key={r} value={r}>{r}</option>)}
          <option value="other">Other</option>
        </Filter>
        <Filter label="Class" value={characterClass} onChange={(v) => setParam('class', v)}>
          <option value="">Any</option>
          {CLASSES.map((c) => <option key={c} value={c}>{c}</option>)}
          <option value="other">Other</option>
        </Filter>
        <Filter label="Sort by" value={sort} onChange={(v) => setParam('sort', v)}>
          {SORTS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
        </Filter>
      </section>

      {loading && !data && <Loading slow={slow} />}
      {error && <ErrorState message={error.message} onRetry={retry} />}

      {!error && data && characters.length === 0 && (
        filtered
          ? <EmptyState title="No matches">Try a different name or clear the filters.</EmptyState>
          : (
            <EmptyState title="No characters yet" action={<Link to="/characters/new" className="btn">Start a new sheet</Link>}>
              Grab a pencil and fill in your first character sheet.
            </EmptyState>
          )
      )}

      {!error && characters.length > 0 && (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {characters.map((character) => <IndexCard key={character._id} character={character} />)}
        </div>
      )}
    </div>
  );
};

export default CharacterList;
