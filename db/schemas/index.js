import { createUsersTable } from './users.js';

export const ensureSchema = () => {
  console.info('Ensure Schema');
  createUsersTable();
};
