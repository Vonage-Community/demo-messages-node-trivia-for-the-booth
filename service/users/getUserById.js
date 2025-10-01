import db from '../../db/index.js';
import { requireUInt } from '../helpersAndGuards.js';
import debug from './log.js';

const log = debug.extend('fetch_id');

export const selectUserById = db.prepare(`
  SELECT id, name, email, phone
  FROM users
  WHERE id = ?
`);

export const getUserById = (id) => {
  log(`Fetching user By ID ${id}`);
  requireUInt('id', id);
  const user = selectUserById.get(id) || null;

  if (!user) {
    log('No user with that Id found');
    throw {
      code: -32004,
      message: 'User not found',
    };
  }

  return user;
};
