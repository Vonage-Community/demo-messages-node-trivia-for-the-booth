import db from '../../db/index.js';
import { requireUInt } from '../helpersAndGuards.js';
import { fromQuestionRow } from './fromQuestionRow.js';
import debug from './log.js';

const log = debug.extend('first-question');

const firstQuestionStmt = db.prepare(`
  SELECT
    question_id AS id,
    game_id,
    question_text AS question,
    choice_a,
    choice_b,
    choice_c,
    choice_d,
    correct_choice,
    player_count,
    correct_answer_count,
    count_choice_a,
    count_choice_b,
    count_choice_c,
    count_choice_d,
    incorrect_answer_count,
    sort_order
  FROM game_detail_view
  WHERE game_id = ?
  ORDER BY sort_order ASC
  LIMIT 1
`);

export const getFirstQuestionForGame = (gameId, detailed = false) => {
  log(`Fetching first question for game ${Number(gameId)}`);
  requireUInt('gameId', gameId);

  const row = firstQuestionStmt.get(Number(gameId));
  return row ? fromQuestionRow(row, detailed) : null;
};
