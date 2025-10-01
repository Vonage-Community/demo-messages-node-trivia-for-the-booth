import db from '../../db/index.js';
import { gameFromRow } from './gameFromRow.js';
import debug from './log.js';

const log = debug.extend('fetch_id');

export const selectGameById = db.prepare(`
  SELECT id, title, active
  FROM games
  WHERE id = ?
`);

export const getGameById = (id) => {
  log(`Fetching ${id}`);
  const game = selectGameById.get(id) || null;

  if (!game) {
    log(`${id} not found`);
    throw {
      code: -32004,
      message: 'Game not found',
    };
  }

  log(`Fetched ${id}`);
  return gameFromRow(game);
};
