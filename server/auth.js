import debug from './log.js';
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

  if (role && user.role !== role) {
    log('Invalid role');
    throw {
      code: 403,
      message: 'Forbidden: Invalid role',
    };
  }

  return fn(args);
};

