import db from '../../db/index.js';
import { getQuestionById } from './getQuestionById.js';
import debug from './log.js';

const log = debug.extend('delete');

export const deleteQuestionById = db.prepare(`
  DELETE FROM questions WHERE id = ?
`);

export const deleteQuestion = (id) => {
  log(`Deleting question ${id}`);
  const existing = getQuestionById(id);
  deleteQuestionById.run(id);
  log(`Question ${id} deleted`);
  return existing;
};
