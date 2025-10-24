import { fetchForLogin } from '../../service/users/fetchForLogin.js';
import debug from '../log.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { privateKey } from '../vonage.js';

const log = debug.extend('login');

export const loginMethod = async ({ email, password }) => {
  log('Login');

  let user;
  try {
    user = fetchForLogin(email);
  } catch {
    log('Email not found');
    throw {
      code: 400,
      message: 'Invalid login',
      data: {
        email: 'Incorrect Email',
      },
    };
  }

  log('User', user);

  if (bcrypt.compareSync(password, user.password)) {
    log('Login successful');
    return {
      token: jwt.sign(
        {
          id: user.id,
          name: user.name,
          role: user.role,
        },
        privateKey,
        {
          algorithm: 'RS256',
          header: { typ: 'JWT', alg: 'RS256' },
          expiresIn: '3h',
        },
      ),
    };
  }

  throw {
    code: 400,
    message: 'Invalid login',
    data: {
      password: 'Invalid password',
    },
  };
};



