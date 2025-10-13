import { fetchForLogin } from '../../service/users.js';
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
  } catch (error) {

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
  log(password, user.password);

  if (bcrypt.compareSync(password, user.password)) {
    log('Login successful');
    return {
      token: jwt.sign(
        {
          ...user,
        },
        privateKey,
        {
          algorithm: 'RS256',
          header: { typ: 'JWT', alg: 'RS256' },
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



