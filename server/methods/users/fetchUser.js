import { getUserById, getUserByEmail } from '../../../service/users.js';
import debug from './log.js';

const log = debug.extend('fetch');

export const fetchUserMethod = async ({ id, email }) => {
  log('Fetching user');
  if (id) {
    log(`Fetching user using id ${id}`);
    return getUserById(id);
  }

  if (!email) {
    log('Fetching user by email');
    return getUserByEmail(email);
  }

  log('Missing id or email');

  throw {
    code: -32602,
    message: 'email or id is required',
  };
};
