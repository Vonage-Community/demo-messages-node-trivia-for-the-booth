import debug from './log.js';
import { gameLeaderboard } from '../../../service/games/leaderBoard.js';

const log = debug.extend('leader_board');

export const gameLeaderboardMethod = async (args) => {
  log('Game leaderboard');
  return gameLeaderboard(args.gameId);
};
