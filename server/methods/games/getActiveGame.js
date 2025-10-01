import { getActiveGame } from '../../../service/games.js';
import debug from './log.js';

const log = debug.extend('fetch_active');

export const getActiveGameMethod = async () => {
  log('Fetching active game');
  return getActiveGame();
};
