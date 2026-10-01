import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { createCharacter, getCharacter, updateCharacter } from '../api/characters.js';
import { errorDetails, errorMessage } from '../api/client.js';
import { useApi, useSlow } from '../hooks/useApi.js';
import { useDiceRoller } from '../hooks/useDiceRoller.js';
import { emptySheet, setIn, sheetFromCharacter, toPayload } from '../lib/sheet.js';
import CharacterSheetForm from '../components/sheet/CharacterSheetForm.jsx';
import DiceTray from '../components/character/DiceTray.jsx';
import ConfirmDelete from '../components/ui/ConfirmDelete.jsx';
import { ErrorState, Loading } from '../components/ui/States.jsx';
import NotFound from './NotFound.jsx';

const SheetEditor = ({ character }) => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const roller = useDiceRoller();
  const [sheet, setSheet] = useState(() => (character ? sheetFromCharacter(character) : emptySheet()));
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [nameError, setNameError] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const set = useCallback((path, value) => {
    setSheet((current) => setIn(current, path, value));
    setDirty(true);
    if (path === 'name') setNameError(null);
  }, []);

  // Warn before closing the tab with unsaved changes.
  useEffect(() => {
    if (!dirty) return undefined;
    const warn = (event) => event.preventDefault();
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty]);

  const save = async (event) => {
    event.preventDefault();
    if (!sheet.name.trim()) {
      setNameError('Every character needs a name.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    setSaving(true);
    try {
      const payload = toPayload(sheet);
      if (character) {
        await updateCharacter(character._id, payload);
        setDirty(false);
        enqueueSnackbar('Saved.', { variant: 'success' });
      } else {
        const created = await createCharacter(payload);
        setDirty(false);
        enqueueSnackbar(`${created.name} saved.`, { variant: 'success' });
        navigate(`/characters/${created._id}`, { replace: true });
      }
    } catch (error) {
      const details = errorDetails(error);
      enqueueSnackbar(details.length ? details.map((d) => d.message).join(' ') : errorMessage(error), { variant: 'error' });
    }
    setSaving(false);
  };

  return (
    <form onSubmit={save} noValidate>
      <div className="no-print mb-4 flex flex-wrap items-center justify-between gap-3">
        <Link to="/" className="text-lg tracking-[0.04em] text-paper/80 hover:text-paper">← All characters</Link>
        <div className="flex flex-wrap items-center gap-3">
          {dirty && <span className="font-hand text-lg text-paper/80">unsaved changes</span>}
          <button type="submit" className="btn-dark" disabled={saving}>{saving ? 'Saving…' : 'Save'}</button>
          <button type="button" className="btn" onClick={() => window.print()}>Print / PDF</button>
          {character && <button type="button" className="btn-red" onClick={() => setConfirmDelete(true)}>Delete</button>}
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_17rem] print:block">
        <CharacterSheetForm sheet={sheet} set={set} roll={roller.setupCheck} nameError={nameError} />
        <div className="xl:sticky xl:top-4 xl:self-start">
          <DiceTray roller={roller} />
        </div>
      </div>

      {confirmDelete && (
        <ConfirmDelete character={character} onClose={() => setConfirmDelete(false)} onDeleted={() => navigate('/')} />
      )}
    </form>
  );
};

const ExistingCharacter = ({ id }) => {
  const { data: character, loading, error, retry } = useApi((signal) => getCharacter(id, signal), [id]);
  const slow = useSlow(loading);

  if (loading) return <Loading slow={slow} />;
  if (error?.status === 404 || error?.status === 400) return <NotFound />;
  if (error) return <ErrorState message={error.message} onRetry={retry} />;
  return <SheetEditor key={character._id} character={character} />;
};

const CharacterPage = () => {
  const { id } = useParams();
  return id ? <ExistingCharacter id={id} /> : <SheetEditor />;
};

export default CharacterPage;
