import { updateQuestion } from '../../../service/questions.js';
import debug from './log.js';

const log = debug.extend('update');

export const updateQuestionMethod = async ({ questionId, ...args }) => {
  log(`Updating question ${questionId}`);
  return updateQuestion(questionId, args);
};
