import db from '../../db/index.js';
import debug from './log.js';

const log = debug.extend('player_answers');

export const getAnswersByPlayerId = db.prepare(`
  SELECT
    id,
    game_id,
    question_id,
    player_id,
    player_answer,
    client_received_at,
    client_answered_at,
    server_received_at,
    response_time_ms
  FROM answers
  WHERE player_id = ?
`);

export const getAnswersForPlayer = ({ playerId, gameId }) => {
  log(`Getting answers for player ${playerId}`);
  const answers = getAnswersByPlayerId.all(playerId).filter(
    ({ game_id }) => {
      if (gameId) {
        return game_id === gameId;
      }

      return true;
    },
  ).map((answer) => ({
    id: answer.id,
    gameId: answer.game_id,
    questionId: answer.question_id,
    playerId: answer.player_id,
    playerAnswer: answer.player_answer,
    clientReceivedAt: answer.client_received_at,
    clientAnsweredAt: answer.client_answered_at,
    serverReceivedAt: answer.server_received_at,
    responseTimeMs: answer.response_time_ms,
  }));

  log(`Answers for player ${playerId}`, answers);
  return answers;
};


