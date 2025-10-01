import db from '../db/index.js';
import { ensureSchema } from '../db/schemas/index.js';

beforeAll(() => {
  ensureSchema();
});

afterAll(() => {
  try {
    db.close?.();
  } catch {
    // falls-through
  }
});
