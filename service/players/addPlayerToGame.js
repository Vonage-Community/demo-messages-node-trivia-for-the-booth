import db from '../../db/index.js';
import { requireUInt } from '../helpersAndGuards.js';
import { getGameById } from '../games.js';
import debug from './log.js';

const log = debug.extend('add-player');

const insertPlayerStmt = db.prepare(`
  INSERT INTO players (game_id, player_id)
  VALUES (@gameId, @playerId)
`);

export const addPlayerToGame = (args = {}) => {
  log('Adding player to game', args);

  const gameId = requireUInt('gameId', args.gameId);
  const playerId = requireUInt('playerId', args.playerId);

  const game = getGameById(gameId);

  if (!game.active && !game.bonusGame) {
    throw {
      code: 400,
      message: 'Game is not active.',
    };
  }

  insertPlayerStmt.run({
    gameId: game.id,
    playerId,
  });

  log(`Player ${playerId} joined game ${gameId}`);

  return {
    game,
    playerId,
  };
};
