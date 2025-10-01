import { setActiveGame } from '../../../service/games.js';
import debug from './log.js';

const log = debug.extend('activate');

export const activateGameMethod = async ({ id }) => {
  log(`Activating game ${id}`);
  return setActiveGame(id);
};
