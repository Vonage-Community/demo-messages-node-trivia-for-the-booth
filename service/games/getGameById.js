import db from '../../db/index.js';
import {
  requireUuid,
} from '../helpersAndGuards.js';
import { gameFromRow } from './fromRow.js';

export const selectGameById = db.prepare(`
  SELECT id, title, active
  FROM games
  WHERE id = ?
`);

export const getGameById = (id) => {
  requireUuid('id', id);
  const game = selectGameById.get(id) || null;

  console.debug('Game', game);

  if (!game) {
    throw {
      code: -32004,
      message: 'Game not found',
    };
  }

  return gameFromRow(game);
};
