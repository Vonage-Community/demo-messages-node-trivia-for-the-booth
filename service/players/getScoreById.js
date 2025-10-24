import db from '../../db/index.js';
import { requireUInt } from '../helpersAndGuards.js';
import debug from './log.js';

const log = debug.extend('fetch_id');

export const selectScoreById = db.prepare(`
  SELECT
  id,
  game_id AS gameId,
  answer_id AS answerId,
  user_id AS userId,
  score_type AS scoreType,
  score_points AS scorePoints

  FROM scores
  WHERE id = ?
`);

export const getScoreById = (id) => {
  log(`Fetching score By ID ${id}`);
  requireUInt('id', id);
  const score = selectScoreById.get(id) || null;

  if (!score) {
    log('No score with that Id found');
    throw {
      code: -32004,
      message: 'Score not found',
    };
  }

  return score;
};
