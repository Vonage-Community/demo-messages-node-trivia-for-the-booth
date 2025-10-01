import { createUser } from '../../../service/users.js';
import debug from './log.js';

const log = debug.extend('register');

export const registerUserMethod = async (args = {}) => {
  log('Register User', args);

  return createUser(args);
};
