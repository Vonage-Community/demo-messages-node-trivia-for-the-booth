import db from '../../db/index.js';
import { gameFromRow } from './gameFromRow.js';
import debug from './log.js';

const log = debug.extend('fetch_id');

export const selectGameById = db.prepare(`
  SELECT id, title, active
  FROM games
  WHERE id = ?
`);

export const selectGameDetailById = db.prepare(`
  SELECT
    game_id AS id,
    game_title,
    active,
    player_count AS playerCount,
    question_text AS question,
    question_id AS questionId,
    choice_a AS choiceA,
    choice_b AS choiceB,
    choice_c AS choiceC,
    choice_d AS choiceD,
    correct_choice AS correctChoice,
    count_choice_a AS countChoiceA,
    count_choice_b AS countChoiceB,
    count_choice_c AS countChoiceC,
    count_choice_d AS countChoiceD,
    correct_answer_count AS answeredCorrect,
    incorrect_answer_count AS answeredIncorrectly
  FROM game_detail_view
  WHERE game_id = ?
`);

export const getGameById = (id) => {
  log(`Fetching ${id}`);
  const game = selectGameById.get(Number(id)) || null;

  if (!game) {
    throw {
      code: -32004,
      message: 'Game not found',
    };
  }

  log(`Fetched ${id}`);
  return gameFromRow(game);
};

export const getGameDetail = (id) => {
  log(`Fetching game detail for ${id}`);

  const rows = selectGameDetailById.all(id);
  log('Detail rows', rows);
  if (!rows || rows.length === 0) {
    log(`${id} not found`);
    throw {
      code: -32004,
      message: 'Game not found',
    };
  }

  const first = rows[0];
  const questions = rows.map((row) => {
    if (!row.question) {
      return;
    }

    return {
      question: row.question,
      questionId: row.questionId,
      choiceA: row.choiceA,
      choiceB: row.choiceB,
      choiceC: row.choiceC,
      choiceD: row.choiceD,
      correctChoice: row.correctChoice,
      countChoiceA: row.countChoiceA,
      countChoiceB: row.countChoiceB,
      countChoiceC: row.countChoiceC,
      countChoiceD: row.countChoiceD,
      answeredCorrect: row.answeredCorrect,
      answeredIncorrectly: row.answeredIncorrectly,
    };
  }).filter((row) => row);

  const game = {
    id: first.id,
    title: first.title,
    active: Boolean(first.active),
    questionCount: questions.length,
    playerCount: first.playerCount ?? 0,
    questions: questions,
  };

  log(`Fetched game detail for ${id}`);
  return game;
};
