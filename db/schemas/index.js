import { createUsersTable } from './users.js';
import { createGamesTable } from './games.js';

export const ensureSchema = () => {
  console.info('Ensure Schema');
  createUsersTable();
  createGamesTable();
};
