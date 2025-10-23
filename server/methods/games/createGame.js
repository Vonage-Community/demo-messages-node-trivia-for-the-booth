import { createGame } from '../../../service/games/createGame.js';
import debug from './log.js';

const log = debug.extend('create');

export const createGameMethod = async (args) => {
  log('Creating game');
  return createGame(args);
};

