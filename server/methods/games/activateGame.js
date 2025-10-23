import { setActiveGame } from '../../../service/games/setActiveGame.js';
import debug from './log.js';

const log = debug.extend('activate');

export const activateGameMethod = async ({ id }) => {
  log(`Activating game ${id}`);
  return setActiveGame(id);
};
