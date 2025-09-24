import { createUsersTable } from './users.js';
import { createGamesTable } from './games.js';
import { createQuestionsTable } from './questions.js';

export const ensureSchema = () => {
  console.info('Ensure Schema');
  createUsersTable();
  createGamesTable();
  createQuestionsTable();
};
