import db from '../../db/index.js';
import { getActiveGame } from './getActiveGame.js';
import { gameFromRow } from './gameFromRow.js';
import debug from './log.js';

const log = debug.extend('deactivate');

export const deactivateGameById = db.prepare(`
  UPDATE games
  SET
    active = 0
  WHERE id = ?
`);

export const deactivateGame = () => {
  const game = getActiveGame();
  log(`Deactivating game ${game?.id}`);
  game.active = 0;
  deactivateGameById.run(game.id);
  log(`Deactivated ${game.id}`);
  return gameFromRow(game);
};
