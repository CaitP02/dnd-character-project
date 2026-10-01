import { Router } from 'express';
import {
  createCharacter, deleteCharacter, getCharacter, listCharacters, updateCharacter,
} from '../controllers/characterController.js';
import { validateObjectId } from '../middleware/validateObjectId.js';

// Express 5 forwards rejected promises from async handlers to the error handler.
const router = Router();

router.route('/')
  .get(listCharacters)
  .post(createCharacter);

router.route('/:id')
  .all(validateObjectId)
  .get(getCharacter)
  .put(updateCharacter)
  .delete(deleteCharacter);

export default router;
