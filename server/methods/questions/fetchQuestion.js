import { getQuestionById } from '../../../service/questions.js';
import debug from './log.js';

const log = debug.extend('fetch_id');

export const fetchQuestionMethod = async ({ id }) => {
  log(`Fetching question ${id}`);
  return getQuestionById(id);
};
