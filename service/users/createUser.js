import db from '../../db/index.js';
import { requireNonEmptyString } from '../helpersAndGuards.js';
import { getUserByEmail } from './getUserByEmail.js';
import debug from './log.js';
import bcrypt from 'bcryptjs';

const log = debug.extend('create');

export const insertUser = db.prepare(`
  INSERT INTO users (name, password, email, phone)
  VALUES (@name, @password, @email, @phone)
`);

export const createUser = (args) => {
  log('Creating user');
  const { name, email, phone, password } = args;

  let existing;
  try {
    existing = getUserByEmail(email);
  } catch {
    // falls-through
  }

  if (existing) {
    log('A user with that email exists');
    const message = 'Email already registered';
    throw {
      code: -32010,
      message: message,
      data: {
        email: message,
      },
    };
  }

  const salt = bcrypt.genSaltSync(10);
  const user = {
    name: requireNonEmptyString('name', name),
    email: requireNonEmptyString('email', email),
    password: bcrypt.hashSync(
      requireNonEmptyString('password', password),
      salt,
    ),
    phone: requireNonEmptyString('phone', phone),
  };

  const info = insertUser.run(user);
  user.id = info.lastInsertRowid;
  delete user.password;
  log('User created');
  return user;
};


