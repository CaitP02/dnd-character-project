import mongoose from 'mongoose';
import { HttpError } from './errorHandler.js';

export const validateObjectId = (req, res, next) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return next(new HttpError(400, `"${req.params.id}" is not a valid character id`));
  }
  next();
};
