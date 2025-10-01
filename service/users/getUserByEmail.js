import db from '../../db/index.js';
import { requireNonEmptyString } from '../helpersAndGuards.js';
import debug from './log.js';

const log = debug.extend('fetch_email');

export const selectUserByEmail = db.prepare(`
  SELECT id, name, email, phone
  FROM users
  WHERE email = ?
`);

export const getUserByEmail = (email) => {
  log('Fetching user by Email');
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
