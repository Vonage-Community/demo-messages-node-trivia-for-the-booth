import { createQuestionMethod } from './createQuestion.js';
import { deleteQuestionMethod } from './deleteQuestion.js';
import { fetchQuestionMethod } from './fetchQuestion.js';
import { getQuestionsForGameMethod } from './getQuestionsForGame.js';
import { updateQuestionMethod } from './updateQuestion.js';

export const questions = {
  create: createQuestionMethod,
  delete: deleteQuestionMethod,
  fetch: fetchQuestionMethod,
  for_game: getQuestionsForGameMethod,
  update: updateQuestionMethod,
};
