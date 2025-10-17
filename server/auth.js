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

export const basicAuth = (req, res, next) => {
  log('Checking path', req.path);
  if (!req.path.startsWith('/admin')) {
    log('Not admin path');
    return next();
  }

  log('Admin path');

  const header = req.headers.authorization || '';
  const [scheme, encoded] = header.split(' ');

  if (scheme !== 'Basic' || !encoded) {
    res.set('WWW-Authenticate', 'Basic realm="Admin Area"');
    return res.status(401).send('Authentication required');
  }

  const [user, pass] = Buffer.from(encoded, 'base64').toString().split(':');

  const validUser = process.env.TRIVIA_ADMIN_EMAIL || 'admin';
  const validPass = process.env.TRIVIA_ADMIN_PASSWORD || 'password';

  if (user === validUser && pass === validPass) {
    return next();
  }

  res.set('WWW-Authenticate', 'Basic realm="Admin Area"');
  return res.status(401).send('Invalid credentials');
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
