import db from '../../db/index.js';
import { requireUInt } from '../helpersAndGuards.js';
import { getGameById } from '../games.js';
import debug from './log.js';
import { isPlayerPlayingGame } from './isPlayerPlayingGame.js';

const log = debug.extend('add-player');

export const insertPlayerStmt = db.prepare(`
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

  const params = {
    gameId: game.id,
    playerId,
  };

  log('Player params', params);
  const alreadyPlaying = isPlayerPlayingGame(params);

  if (alreadyPlaying) {
    log(`Player ${playerId} already joined game ${gameId}`);
    return { game, playerId };
  }

  try {
    log('Player is joining the game');

    insertPlayerStmt.run(params);

    log(`Player ${playerId} joined game ${gameId}`);
  } catch (error) {
    log('SQLError', error);

  }

  return {
    game,
    playerId,
  };
};
