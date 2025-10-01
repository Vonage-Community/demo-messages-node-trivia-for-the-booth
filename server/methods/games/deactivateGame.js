import { deactivateGame } from '../../../service/games.js';
import debug from './log.js';

const log = debug.extend('deactivate');

export const deactivateGameMethod = async ({ id }) => {
  log(`Deactivating game ${id}`);
  return deactivateGame(id);
};
