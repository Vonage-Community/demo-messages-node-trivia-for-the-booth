import db from '../../db/index.js';
import { gameFromRow } from './gameFromRow.js';
import debug from './log.js';

const log = debug.extend('active');

export const selectActive = db.prepare(`
    SELECT id, title, active
    FROM games
    WHERE active = 1
    LIMIT 1
  `);

export const getActiveGame = () => {
  log('Fetching active');
  const activeGame = gameFromRow(selectActive.get());

  if (!activeGame) {
    log('No active game found');
    throw {
      code: -32004,
      message: 'No active game found',
    };
  }

  log(`${activeGame.id} Active`);
  return activeGame;
};
