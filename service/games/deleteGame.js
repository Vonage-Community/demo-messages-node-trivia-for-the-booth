import db from '../../db/index.js';
import { getGameById } from './getGameById.js';
import debug from './log.js';

const log = debug.extend('delete');

export const deleteGameById = db.prepare(`
  DELETE FROM games WHERE id = ?
`);

export const deleteGame = (id) => {
  log(`Deleting ${id}`);
  const existing = getGameById(id);
  deleteGameById.run(id);
  log(`${id} deleted`);
  return existing;
};

