import { getQuestionById } from '../../../service/questions.js';

export const fetchQuestionMethod = async ({ id }) => getQuestionById(id);
