import { deleteQuestion } from '../../../service/questions.js';
import debug from './log.js';

const log = debug.extend('delete');

export const deleteQuestionMethod = async ({ id }) => {
  log(`Deleting question ${id}`);
  return deleteQuestion(id);
};
