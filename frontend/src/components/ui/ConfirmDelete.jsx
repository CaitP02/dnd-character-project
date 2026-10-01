import { useState } from 'react';
import { useSnackbar } from 'notistack';
import Modal from './Modal.jsx';
import { deleteCharacter } from '../../api/characters.js';
import { errorMessage } from '../../api/client.js';

const ConfirmDelete = ({ character, onClose, onDeleted }) => {
  const [busy, setBusy] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const handleDelete = async () => {
    setBusy(true);
    try {
      await deleteCharacter(character._id);
      enqueueSnackbar(`${character.name} deleted.`, { variant: 'success' });
      onDeleted?.(character);
      onClose();
    } catch (error) {
      enqueueSnackbar(errorMessage(error), { variant: 'error' });
      setBusy(false);
    }
  };

  return (
    <Modal open={Boolean(character)} title={`Delete ${character?.name}?`} onClose={busy ? () => {} : onClose}>
      <p className="font-hand text-xl text-pencil">
        This throws the sheet away for good. It cannot be undone.
      </p>
      <div className="mt-6 flex justify-end gap-3">
        <button type="button" className="btn" onClick={onClose} disabled={busy}>Cancel</button>
        <button type="button" className="btn-red" onClick={handleDelete} disabled={busy}>
          {busy ? 'Deleting…' : 'Delete'}
        </button>
      </div>
    </Modal>
  );
};

export default ConfirmDelete;
