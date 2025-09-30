import db from '../../db/index.js';
import { getQuestionById } from './getQuestionById.js';

export const deleteQuestionById = db.prepare(`
  DELETE FROM questions WHERE id = ?
`);

export const deleteQuestion = (id) => {
  const existing = getQuestionById(id);
  deleteQuestionById.run(id);
  return existing;
};
