import db from '../../db/index.js';
import { requireNonEmptyString } from '../helpersAndGuards.js';
import debug from './log.js';

const log = debug.extend('fetch_email');

export const selectUserByEmail = db.prepare(`
  SELECT id, name, password, role
  FROM users
  WHERE email = ?
`);

export const fetchForLogin = (email) => {
  log('Fetching user by Email for login');
  requireNonEmptyString('email', email);
  const user = selectUserByEmail.get(email) || null;

  if (!user) {
    log('No user with that email');
    throw {
      code: -32004,
      message: 'User not found',
    };
  }

  return user;
};
