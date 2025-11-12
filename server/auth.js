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

  if (role && user.role !== role) {
    log('Invalid role');
    throw {
      code: 403,
      message: 'Forbidden: Invalid role',
    };
  }

  return fn(args);
};

export const jwtAuth = (req) => {
  const header = req.headers?.authorization ?? '';
  const token = header.replace(/^Bearer\s+/i, '').trim();

  let decoded;
  if (token) {
    try {
      decoded = jsonwebtoken.verify(
        token,
        privateKey,
        {
          algorithms: ['RS256', 'HS256'],
        },
      );

      log('JWT Decoded', decoded);
      return decoded;
    } catch (error) {
      console.error('Error decoding JWT', error);
    }
  }
};
