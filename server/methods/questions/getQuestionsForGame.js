import { getQuestionsForGame } from '../../../service/questions/getQuestionsForGame.js';
import debug from './log.js';

const log = debug.extend('fetch_questions');

export const getQuestionsForGameMethod = async (args) => {
  const { gameId, _auth: auth } = args;
  log(`Fetching questions for game ${gameId}`);

  return getQuestionsForGame(Number(gameId), auth.role === 'admin');
};
