import db from '../../db/index.js';
import { v7 as uuidv7 } from 'uuid';
import { requireNonEmptyString } from '../helpersAndGuards.js';
import { getUserByEmail } from './getUserByEmail.js';
import debug from './log.js';

const log = debug.extend('create');

export const insertUser = db.prepare(`
  INSERT INTO users (name, email, phone)
  VALUES (@name, @email, @phone)
`);

export const createUser = (args) => {
  log('Creating user');
  const { name, email, phone } = args;

  let existing;
  try {
    existing = getUserByEmail(email);
  } catch {
    // falls-through
  }

  if (existing) {
    log('A user with that email exists');
    throw {
      code: -32010,
      message: 'Email already registered',
    };
  }

  const user = {
    name: requireNonEmptyString('name', name),
    email: requireNonEmptyString('email', email),
    phone: requireNonEmptyString('phone', phone),
  };

  const info = insertUser.run(user);
  user.id = info.lastInsertRowid;
  log('User created');
  return user;
};


