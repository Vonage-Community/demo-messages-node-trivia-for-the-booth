import { updateGame } from '../../../service/games.js';
import debug from './log.js';

const log = debug.extend('update');

export const updateGameMethod = async ({ active, ...args }) => {
  log(`Updating game ${args.id}`);
  return updateGame(args.id, args);
};

