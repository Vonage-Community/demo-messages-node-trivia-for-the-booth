import db from '../../db/index.js';
import { requireUInt } from '../helpersAndGuards.js';
import { getGameById } from '../games/getGameById.js';
import { fromQuestionRow } from '../questions/fromQuestionRow.js';
import { completeGameForPlayer } from './completeGameForPlayer.js';
import debug from './log.js';

const log = debug.extend('next-question');

const nextQuestionStmt = db.prepare(`
  SELECT
    q.id AS question_id,
    q.game_id,
    q.question,
    q.choice_a,
    q.choice_b,
    q.choice_c,
    q.choice_d,
    q.correct_choice,
    q.sort_order,
    src.type AS source
  FROM (
    SELECT 'pending' AS type, qid AS id
    FROM (
      SELECT a.question_id AS qid
      FROM answers a
      WHERE a.game_id = @gameId
        AND a.player_id = @playerId
        AND a.player_answer = 'N'
      LIMIT 1
    )
    UNION ALL
    SELECT 'unanswered' AS type, qid AS id
    FROM (
      SELECT q.id AS qid
      FROM questions q
      WHERE q.game_id = @gameId
        AND q.id NOT IN (
          SELECT a.question_id
          FROM answers a
          WHERE a.game_id = @gameId
            AND a.player_id = @playerId
        )
      ORDER BY q.sort_order ASC
      LIMIT 1
    )
  ) src
  JOIN questions q ON q.id = src.id
  ORDER BY src.type = 'unanswered'
  LIMIT 1
`);

export const recordPresentedStmt = db.prepare(`
  INSERT OR IGNORE INTO answers (game_id, question_id, player_id, player_answer, client_received_at)
  VALUES (@gameId, @questionId, @playerId, 'N', COALESCE(@clientRecievedAt, strftime('%s','now')))
`);

export const getNextQuestionForPlayer = (args = {}) => {
  const gameId = requireUInt('gameId', args.gameId);
  const playerId = requireUInt('playerId', args.playerId);
  const game = getGameById(gameId);

  if (!game.active && !game.bonusGame) {
    throw { code: 400, message: 'Game is not active.' };
  }

  const question = nextQuestionStmt.get({ gameId, playerId });
  log('Next question', question);

  if (!question) {
    completeGameForPlayer({ gameId, playerId });
    return null;
  }

  // record presentation if new
  if (question.source === 'unanswered') {
    recordPresentedStmt.run({
      gameId,
      questionId: question.question_id,
      playerId,
    });
  }

  log(`Presenting question ${question.question_id} (${question.source})`);
  return fromQuestionRow(question, false);
};
