import db from '../../db/index.js';
import {
  requireUuid,
} from '../helpersAndGuards.js';

export const selectQuestionById = db.prepare(`
  SELECT id, game_id, question, choice_a, choice_b, choice_c, choice_d, correct_choice
  FROM questions
  WHERE id = ?
`);

export const getQuestionById = (id) => {
  console.info(`Getting question ${id}`);
  requireUuid('id', id);
  const game = selectQuestionById.get(id) || null;

  if (!game) {
    throw {
      code: -32004,
      message: 'Game not found',
    };
  }

  return game;


};
