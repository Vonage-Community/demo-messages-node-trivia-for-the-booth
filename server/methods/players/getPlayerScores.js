import { getPlayerScores } from '../../../service/players/getPlayerScore.js';
import debug from './log.js';

const log = debug.extend('scores');

const formatResult = (scores) => scores.reduce(
  (playerScores, score) => {
    log('Score', score);
    const { gameId, questionId } = score;
    if (!gameId) {
      playerScores.bonus.push({
        type: score.scoreType,
        points: score.scorePoints,
        question: score.question ?? undefined,
      });
      playerScores.totalScore += score.scorePoints;
      return playerScores;
    }

    let scoreGame = playerScores.games.find(
      ({ gameId: scoreGameId }) => scoreGameId === gameId,
    );

    if (!scoreGame) {
      scoreGame = {
        gameId,
        questions: [],
      };
      playerScores.games.push(scoreGame);
    }

    let scoreQuestion = scoreGame.questions.find(({ questionId: scoreQuestionId }) => questionId === scoreQuestionId);

    if (!scoreQuestion) {
      scoreQuestion = {
        questionId,
        scores: [],
      };
      scoreGame.questions.push(scoreQuestion);
    }

    scoreQuestion.scores.push({
      type: score.scoreType,
      points: score.scorePoints,
    });

    playerScores.totalScore += score.scorePoints;
    return playerScores;
  },
  {
    games: [],
    bonus: [],
    totalScore: 0,
  },
);

export const getPlayerScoresMethod = async (args = {}) => {
  log('Getting player scores', args);
  return formatResult(getPlayerScores({
    ...args,
    userId: args.userId ?? args._auth?.id,
  }));
};
