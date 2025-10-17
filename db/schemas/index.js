import { createUsersTable } from './users.js';
import { createGamesTable } from './games.js';
import { createQuestionsTable } from './questions.js';
import { createPlayersTable } from './players.js';
import { createGamesView } from './gamesView.js';
import { createAnswersTable } from './answers.js';
import { createGameDetailView } from './gameDetailView.js';
import { createCorrectAnswersView } from './correctAnswerView.js';
import { createPlayerBonusTable } from './playerBonuses.js';
import { createQuestionsLimitTrigger } from './questionLimitTrigger.js';
import { createPlayerScoresView } from './playerScores.js';

import debug from './log.js';

const log = debug.extend('migration');

export const ensureSchema = () => {
  log('Ensure Schema');
  createUsersTable();
  createGamesTable();
  createQuestionsTable();
  createPlayersTable();
  createAnswersTable();

  createGamesView();
  createGameDetailView();
  createCorrectAnswersView();
  createPlayerBonusTable();
  createPlayerScoresView();

  createQuestionsLimitTrigger();
};
