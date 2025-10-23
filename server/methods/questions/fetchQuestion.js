import { getQuestionById } from '../../../service/questions/getQuestionById.js';
import debug from './log.js';

const log = debug.extend('fetch_id');

export const fetchQuestionMethod = async (args) => {
  const { id, _auth: auth } = args;
  log(`Fetching question ${id}`);
  return getQuestionById(id, auth.role === 'admin');
};
