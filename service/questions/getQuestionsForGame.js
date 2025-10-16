import db from '../../db/index.js';
import {
  requireUInt,
} from '../helpersAndGuards.js';
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
    incorrect_answer_count
  FROM game_detail_view
  WHERE game_id = ?
`);

export const getQuestionsForGame = (gameId, detailed) => {
  log(`Fetching questions for game ${Number(gameId)}`);
  requireUInt('gameId', gameId);
  return listGamesStmt.all(Number(gameId)).map((row) => fromQuestionRow(row, detailed));
};
