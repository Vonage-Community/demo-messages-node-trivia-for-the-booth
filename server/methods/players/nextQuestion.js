import { getNextQuestionForPlayer } from '../../../service/players/getNextQuestionForPlayer.js';
import debug from './log.js';

const log = debug.extend('next-question');

export const nextQuestionMethod = async (args = {}) => {
  log('Next question request', args);
  return getNextQuestionForPlayer({
    ...args,
    playerId: args._auth.id,
  });
};
