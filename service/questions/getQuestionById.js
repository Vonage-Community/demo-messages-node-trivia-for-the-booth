import db from '../../db/index.js';
import {
  requireUInt,
} from '../helpersAndGuards.js';
import { fromQuestionRow } from './fromQuestionRow.js';
import debug from './log.js';

const log = debug.extend('fetch');

export const selectQuestionById = db.prepare(`
  SELECT id, game_id, question, choice_a, choice_b, choice_c, choice_d, correct_choice
  FROM questions
  WHERE id = ?
`);

export const getQuestionById = (id) => {
  log(`Getting question ${id}`);
  const question = selectQuestionById.get(id) || null;

  if (!question) {
    log(`Question ${id} not found`);
    throw {
      code: -32004,
      message: 'Question not found',
    };
  }

  return fromQuestionRow(question);
};
