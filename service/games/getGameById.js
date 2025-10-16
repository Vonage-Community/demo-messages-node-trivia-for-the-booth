import db from '../../db/index.js';
import { gameFromRow } from './gameFromRow.js';
import debug from './log.js';
import { fromQuestionRow } from '../questions/fromQuestionRow.js';

const log = debug.extend('fetch_id');

export const selectGameById = db.prepare(`
  SELECT id, title, active
  FROM games
  WHERE id = ?
`);

export const selectGameDetailById = db.prepare(`
  SELECT
    game_id,
    game_title,
    short_code,
    active,
    question_text AS question,
    question_id AS questionId,
    choice_a,
    choice_b,
    choice_c,
    choice_d,
    player_count,
    correct_choice,
    count_choice_a,
    count_choice_b,
    count_choice_c,
    count_choice_d,
    correct_answer_count,
    incorrect_answer_count
  FROM game_detail_view
  WHERE game_id = ?
`);

export const getGameById = (id, detailed = false) => {
  log(`Fetching game detail for ${id}`);

  const rows = selectGameDetailById.all(Number(id));
  if (!rows || rows.length === 0) {
    log(`${id} not found`);
    throw {
      code: -32004,
      message: 'Game not found',
    };
  }

  const first = rows[0];
  const questions = rows.map((row) => {
    log('question data', row);
    if (!row.question) {
      return;
    }

    return fromQuestionRow(row, detailed);
  }).filter((row) => row);

  log('Raw Game', first);
  const game = gameFromRow(first, detailed);

  game.questions = questions;


  log(`Fetched game detail for ${id}`, game);
  return game;
};
