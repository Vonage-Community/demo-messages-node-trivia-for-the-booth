import db from '../../db/index.js';
import { getGameById } from './getGameById.js';

export const deleteGameById = db.prepare(`
  DELETE FROM games WHERE id = ?
`);

export const deleteGame = (id) => {
  const existing = getGameById(id);
  deleteGameById.run(id);
  return existing;
};

