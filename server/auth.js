import debug from './log.js';
import jsonwebtoken from 'jsonwebtoken';
import { privateKey } from './vonage.js';

const log = debug.extend('auth');

export const requireLogin = (fn, role) => async (args) => {
  log(args);
  const user = args._auth;
  log('Checking login', user);

  if (!user) {
    log('No user');
    throw {
      code: 401,
      message: 'Unauthorized: Login required',
    };
  }

  // If we want to enforce a role
  if (role && user.role !== role) {
    log('Invalid role');
    throw {
      code: 403,
      message: 'Forbidden: Invalid role',
    };
  }

  return fn(args);
};

