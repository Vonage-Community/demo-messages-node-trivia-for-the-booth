import { addPlayerToGame } from '../../../service/players/addPlayerToGame.js';
import debug from './log.js';

const log = debug.extend('start-game');

export const startGameMethod = async (args = {}) => {
  log('Player starting game', args);
  return addPlayerToGame({
    ...args,
    playerId: args._auth?.id,
  });
};
