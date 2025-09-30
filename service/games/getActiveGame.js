import db from '../../db/index.js';
import { gameFromRow } from './fromRow.js';

export const selectActive = db.prepare(`
    SELECT id, title, active
    FROM games
    WHERE active = 1
    LIMIT 1
  `);

export const getActiveGame = () => {
  const activeGame = gameFromRow(selectActive.get());

  if (!activeGame) {
    throw {
      code: -32004,
      message: 'No active game found',
    };
  }

  return activeGame;
};
