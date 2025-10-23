import { getUserById } from '../../../service/users/getUserById.js';
import { getUserByEmail } from '../../../service/users/getUserByEmail.js';
import debug from './log.js';

const log = debug.extend('fetch');

export const fetchUserMethod = async ({ id, email } = {}) => {
  log('Fetching user');

  if (id) {
    return getUserById(id);
  }

  if (email) {
    return getUserByEmail(email);
  }

  log('Missing id or email');

  throw {
    code: -32602,
    message: 'email or id is required',
  };
};
