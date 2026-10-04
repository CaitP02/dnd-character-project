import { rateLimit } from 'express-rate-limit';

// There are no accounts, so cap how fast one visitor can create, edit or
// delete characters. Reads are not limited.
export const writeLimiter = ({ limit, windowMs = 15 * 60 * 1000 }) => rateLimit({
  windowMs,
  limit,
  skip: (req) => req.method === 'GET' || req.method === 'HEAD' || req.method === 'OPTIONS',
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({ error: { message: 'Too many changes in a short time. Please wait a few minutes and try again.' } });
  },
});
