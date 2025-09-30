import { getQuestionsForGame } from '../../../service/questions.js';

export const getQuestionsForGameMethod = async ({ gameId }) => getQuestionsForGame(gameId);
