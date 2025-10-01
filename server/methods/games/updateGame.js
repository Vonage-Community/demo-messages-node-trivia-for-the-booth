import { updateGame } from '../../../service/games.js';
import debug from './log.js';

const log = debug.extend('update');

export const updateGameMethod = async (args) => {
  log(`Updating game ${args.id}`);
  args.active = undefined;
  return updateGame(args.id, args);
};

