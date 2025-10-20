import db from '../../db/index.js';
import { requireUInt } from '../helpersAndGuards.js';
import { getGameById } from '../games.js';
import debug from './log.js';

const log = debug.extend('is-playing');

export const checkForPlayerStmt = db.prepare(`
  SELECT game_id, player_id
  FROM players
  WHERE game_id = @gameId AND player_id = @playerId
`);

export const isPlayerPlayingGame = (args = {}) => {
  log('Checking if player is playing game', args);

  const gameId = requireUInt('gameId', args.gameId);
  const playerId = requireUInt('playerId', args.playerId);

  const game = getGameById(gameId);

  if (!game.active && !game.bonusGame) {
    throw {
      code: 404,
      message: 'Game is not found',
    };
  }

  const params = {
    gameId: game.id,
    playerId,
  };

  log('Player params', params);
  const alreadyPlaying = checkForPlayerStmt.get(params);
  log(`Player is playing ${!!alreadyPlaying}`);

  return !!alreadyPlaying;
};
