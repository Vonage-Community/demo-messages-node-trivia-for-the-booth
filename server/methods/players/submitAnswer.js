import { submitAnswerForPlayer } from '../../../service/players/submitAnswerForPlayer.js';
import debug from './log.js';

const log = debug.extend('submit-answer');

export const submitAnswerMethod = async (args = {}) => {
  log('Submit answer RPC', args);

  return submitAnswerForPlayer({
    ...args,
    playerId: args._auth.id,
  });
};
