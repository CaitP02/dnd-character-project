import mongoose from 'mongoose';

export class HttpError extends Error {
  constructor(status, message, details) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

export const notFound = (req, res) => {
  res.status(404).json({ error: { message: `Route ${req.method} ${req.originalUrl} not found` } });
};

// eslint-disable-next-line no-unused-vars -- Express identifies error handlers by their 4-argument signature
export const errorHandler = (err, req, res, next) => {
  if (err instanceof HttpError) {
    return res.status(err.status).json({ error: { message: err.message, details: err.details } });
  }

  if (err instanceof mongoose.Error.ValidationError) {
    const details = Object.values(err.errors).map((e) => ({ path: e.path, message: e.message }));
    return res.status(400).json({ error: { message: 'Validation failed', details } });
  }

  if (err instanceof mongoose.Error.CastError) {
    return res.status(400).json({ error: { message: `Invalid value for ${err.path}` } });
  }

  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: { message: 'Malformed JSON body' } });
  }

  console.error(err);
  return res.status(500).json({ error: { message: 'Something went wrong on our side' } });
};
