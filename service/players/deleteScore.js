import db from '../../db/index.js';
import { getScoreById } from './getScoreById.js';
import debug from './log.js';

const log = debug.extend('delete');

export const deleteScoreById = db.prepare('DELETE FROM scores WHERE id = ?');

export const deleteScore = (id) => {
  log(`Removing score with id ${id}`);

  const existing = getScoreById(id);
  //  deleteScoreById.run(existing.id);
  return existing;
};
