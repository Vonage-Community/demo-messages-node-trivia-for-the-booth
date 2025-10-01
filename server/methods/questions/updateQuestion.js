import { updateQuestion } from '../../../service/questions.js';
import debug from './log.js';

const log = debug.extend('update');

export const updateQuestionMethod = async ({ id, ...args }) => {
  log(`Updating question ${id}`);
  return updateQuestion(id, args);
};
