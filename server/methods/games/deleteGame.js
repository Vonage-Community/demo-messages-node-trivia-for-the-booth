import { deleteGame } from '../../../service/games.js';
import debug from './log.js';

const log = debug.extend('delete');

export const deleteGameMethod = async ({ id }) => {
  log(`Deleting game ${id}`);
  return deleteGame(id);
};
