import { getActiveGame } from '../../../service/games/getActiveGame.js';
import debug from './log.js';

const log = debug.extend('fetch_active');

export const getActiveGameMethod = async (args) => {
  log('Fetching active game');
  return getActiveGame(args);
};
