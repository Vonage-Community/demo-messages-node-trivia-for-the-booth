import { updateQuestion } from '../../../service/questions.js';

export const updateQuestionMethod = async ({ id, ...args }) => await updateQuestion(id, args);
