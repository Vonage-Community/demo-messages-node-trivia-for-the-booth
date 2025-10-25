import debug from './log.js';
import { leaderboard } from '../../../service/players/leaderBoard.js';

const log = debug.extend('leader_board');

export const leaderboardMethod = async (args) => {
  log('Leaderboard');
  return leaderboard(args.gameId);
};
