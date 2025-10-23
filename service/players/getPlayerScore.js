import db from '../../db/index.js';
import debug from './log.js';

const log = debug.extend('player_score');

export const getScoresByPlayerId = db.prepare(`
  SELECT
    id,
    game_id,
    answer_id,
    user_id,
    score_type,
    score_points
  FROM scores
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
        return game_id === gameId;
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

