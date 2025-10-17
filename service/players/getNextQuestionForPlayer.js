import db from '../../db/index.js';
import { requireUInt } from '../helpersAndGuards.js';
import { getGameById } from '../games.js';
import { fromQuestionRow } from '../questions/fromQuestionRow.js';
import { completeGameForPlayer } from './completeGameForPlayer.js';
import debug from './log.js';

const log = debug.extend('next-question');

const unansweredStmt = db.prepare(`
  SELECT q.id AS question_id,
         q.game_id,
         q.question,
         q.choice_a,
         q.choice_b,
         q.choice_c,
         q.choice_d,
         q.correct_choice,
         q.sort_order
    FROM questions q
   WHERE q.game_id = ?
     AND q.id NOT IN (
       SELECT a.question_id
         FROM answers a
        WHERE a.game_id = ?
          AND a.player_id = ?
     )
   ORDER BY q.sort_order ASC
   LIMIT 1
`);

const recordPresentedStmt = db.prepare(`
  INSERT INTO answers (game_id, question_id, player_id, player_answer, client_received_at)
  VALUES (@gameId, @questionId, @playerId, 'N', strftime('%s','now'))
`);

export const getNextQuestionForPlayer = (args = {}) => {
  log('Fetching next question for player', args);

  const gameId = requireUInt('gameId', args.gameId);
  const playerId = requireUInt('playerId', args.playerId);

  const game = getGameById(gameId);

  if (!game.active && !game.bonusGame) {
    throw {
      code: 400,
      message: 'Game is not active.',
    };
  }

  // find the next unanswered question
  const nextQuestion = unansweredStmt.get(game.id, game.id, playerId);
  if (!nextQuestion) {
    log(`No more questions for player ${playerId} in game ${gameId}`);
    completeGameForPlayer({ gameId, playerId });
    return null;
  }

  // record that we presented it
  recordPresentedStmt.run({
    gameId: game.id,
    questionId: nextQuestion.question_id,
    playerId,
  });

  log(`Presented question ${nextQuestion.question_id} to player ${playerId}`);
  return fromQuestionRow(nextQuestion, false);
};
