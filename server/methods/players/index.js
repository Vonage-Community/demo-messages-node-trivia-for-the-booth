import { requireLogin } from '../../auth.js';
import { startGameMethod } from './startGame.js';
import { nextQuestionMethod } from './nextQuestion.js';
import { submitAnswerMethod } from './submitAnswer.js';
import { getPlayerScoresMethod } from './getPlayerScores.js';

export const players = {
  start: requireLogin(startGameMethod),
  next: requireLogin(nextQuestionMethod),
  answer: requireLogin(submitAnswerMethod),
  scores: requireLogin(getPlayerScoresMethod),
};
