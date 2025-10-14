import { getQuestionsForGame } from '../../../service/questions.js';
import debug from './log.js';

const log = debug.extend('fetch_questions');

export const getQuestionsForGameMethod = async ({ gameId } = {}) => {
  log(`Fetching questions for game ${gameId}`);
  return getQuestionsForGame(Number(gameId));
};
