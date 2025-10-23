import { getNextQuestionForPlayer } from '../../../service/players/getNextQuestionForPlayer.js';
import { getScoreForPlayerInGame } from '../../../service/players/getPlayerScore.js';
import debug from './log.js';

const log = debug.extend('next-question');

export const nextQuestionMethod = async (args = {}) => {
  log('Next question request', args);
  const nextQuestion = getNextQuestionForPlayer({
    ...args,
    playerId: args._auth.id,
  });

  const score = getScoreForPlayerInGame(
    args._auth.id,
    args.gameId,
  );

  return {
    ...nextQuestion,
    totalScore: score,
  };
};
