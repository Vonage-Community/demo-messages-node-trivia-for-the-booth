import db from '../../db/index.js';
import { isPlayerPlayingGame } from '../players/isPlayerPlayingGame.js';
import { gameFromRow } from './gameFromRow.js';
import debug from './log.js';

const log = debug.extend('active');

export const selectActive = db.prepare(`
    SELECT id, title, active, short_code
    FROM games
    WHERE active = 1
    LIMIT 1
  `);

export const getActiveGame = (args) => {
  log('Fetching active');
  const activeGame = gameFromRow(selectActive.get());

  if (!activeGame) {
    log('No active game found');
    throw {
      code: -32004,
      message: 'No active game found',
    };
  }

  const isPlayerPlaying = isPlayerPlayingGame({
    gameId: activeGame.id,
    playerId: args?._auth?.id,
  });

  log(`${activeGame.id} Active`);
  return {
    ...activeGame,
    playing: isPlayerPlaying,
  };
};
