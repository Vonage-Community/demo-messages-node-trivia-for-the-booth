import { listGames } from '../../../service/games.js';
import debug from './log.js';

const log = debug.extend('list');

export const listGamesMethod = async (args) => {
  log('Listing games');
  return listGames(args);
};
