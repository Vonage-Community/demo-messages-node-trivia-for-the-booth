import { fetchQuestionMethod } from './fetchQuestion.js';
import { deleteQuestionMethod } from './deleteQuestion.js';
import { updateQuestionMethod } from './updateQuestion.js';
import { getQuestionsForGameMethod } from './getQuestionsForGame.js';

export const questions = {
  fetch: fetchQuestionMethod,
  delete: deleteQuestionMethod,
  update: updateQuestionMethod,
  for_game: getQuestionsForGameMethod,
};
