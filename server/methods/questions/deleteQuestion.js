import { deleteQuestion } from '../../../service/questions.js';

export const deleteQuestionMethod = async ({ id }) => deleteQuestion(id);
