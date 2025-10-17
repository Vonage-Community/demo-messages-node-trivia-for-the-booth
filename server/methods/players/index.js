import { requireLogin } from '../../auth.js';
import { startGameMethod } from './startGame.js';
import { nextQuestionMethod } from './nextQuestion.js';
import { submitAnswerMethod } from './submitAnswer.js';

export const players = {
  start: requireLogin(startGameMethod),
  next: requireLogin(nextQuestionMethod),
  submit: requireLogin(submitAnswerMethod),
};
