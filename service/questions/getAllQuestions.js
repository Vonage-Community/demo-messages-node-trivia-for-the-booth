import db from '../../db/index.js';
import { fromQuestionRow } from './fromQuestionRow.js';
import debug from './log.js';

const log = debug.extend('list');

const listGamesStmt = db.prepare(`
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
`);

export const getAllQuestions = (detailed) => {
  log('Fetching questions ');
  return listGamesStmt.all()
    .map((row) => fromQuestionRow(row, detailed))
    .filter((question) => question.question);
};
