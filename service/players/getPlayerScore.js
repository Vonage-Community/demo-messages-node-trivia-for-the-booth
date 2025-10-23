import db from '../../db/index.js';
import debug from './log.js';

const log = debug.extend('player_score');

export const getScoresByPlayerId = db.prepare(`
  SELECT
    s.id,
    s.game_id,
    s.answer_id,
    s.user_id,
    s.score_type,
    s.score_points,
    g.title AS game_title,
    q.id AS question_id,
    q.question AS question
  FROM scores s
  LEFT OUTER JOIN games g ON g.id = s.game_id
  LEFT OUTER JOIN answers a ON a.id = s.answer_id
  LEFT OUTER JOIN questions q ON q.id = a.question_id
  WHERE user_id = ?
`);

export const getPlayerScores = ({ userId, gameId, answerId }) => {
  log(`Getting total score for player ${userId}`);
  const scores = getScoresByPlayerId.all(userId).filter(
    ({ answer_id, game_id }) => {
      if (answerId && gameId) {
        return answer_id === answerId && game_id === gameId;
      }

      if (answerId) {
        return answer_id === answerId;
      }

      if (gameId) {
        return `${game_id}` === gameId;
      }

      return true;
    },
  ).map((score) => ({
    id: score.id,
    gameId: score.game_id,
    answerId: score.answer_id,
    userId: score.user_id,
    scoreType: score.score_type,
    scorePoints: score.score_points,
    gameTitle: score.game_title,
    question: score.question,
    questionId: score.question,
  }));

  log(`Scores for player ${userId}`, scores);
  return scores;
};

export const getScoreForPlayer = (playerId) =>
  getPlayerScores({ userId: playerId }).reduce(
    (
      score,
      { scorePoints },
    ) => score += scorePoints,
    0,
  );

export const getScoreForPlayerInGame = (playerId, gameId) =>
  getPlayerScores({ userId: playerId, gameId }).reduce(
    (
      score,
      { scorePoints },
    ) => {
      log('Score', score);
      log('Points', scorePoints);
      score += scorePoints;
      log('New Score', score);
      return score;
    },
    0,
  );

