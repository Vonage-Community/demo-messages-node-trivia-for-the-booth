import db from '../../db/index.js';
import { requireUInt } from '../helpersAndGuards.js';
import debug from './log.js';

const log = debug.extend('complete-game');

const completeStmt = db.prepare(`
  UPDATE players
     SET completed_at = strftime('%s','now')
   WHERE game_id = @gameId
     AND player_id = @playerId
     AND completed_at IS NULL
`);

export const completeGameForPlayer = (args = {}) => {
  log('Completing game for player', args);

  const gameId = requireUInt('gameId', args.gameId);
  const playerId = requireUInt('playerId', args.playerId);

  const info = completeStmt.run({ gameId, playerId });

  if (info.changes === 0) {
    log(`No active game session found for player ${playerId} / game ${gameId}`);
    return { gameId, playerId, alreadyCompleted: true };
  }

  log(`✅ Player ${playerId} completed game ${gameId}`);
  return { gameId, playerId, completed: true };
};
