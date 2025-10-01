import { updateGame } from '../../../service/games.js';
import debug from './log.js';

const log = debug.extend('update');

export const updateGameMethod = async ({ id, ...args }) => {
  log(`Updating game ${id}`);
  return updateGame(id, args);
};

