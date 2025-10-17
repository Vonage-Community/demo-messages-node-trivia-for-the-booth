import { requireLogin } from '../../auth.js';
import { createQuestionMethod } from './createQuestion.js';
import { deleteQuestionMethod } from './deleteQuestion.js';
import { fetchQuestionMethod } from './fetchQuestion.js';
import { getQuestionsForGameMethod } from './getQuestionsForGame.js';
import { updateQuestionMethod } from './updateQuestion.js';
import { generateQuestionsMethod } from './generateQuestions.js';

export const questions = {
  create: requireLogin(createQuestionMethod, 'admin'),
  delete: requireLogin(deleteQuestionMethod, 'admin'),
  fetch: requireLogin(fetchQuestionMethod, 'admin'),
  for_game: requireLogin(getQuestionsForGameMethod),
  update: requireLogin(updateQuestionMethod, 'admin'),
  generate: requireLogin(generateQuestionsMethod, 'admin'),
};
