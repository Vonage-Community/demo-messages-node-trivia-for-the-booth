import db from '../../db/index.js';
import { v7 as uuidv7 } from 'uuid';
import { requireNonEmptyString } from '../helpersAndGuards.js';
import { getUserByEmail } from './getUserByEmail.js';

export const insertUser = db.prepare(`
  INSERT INTO users (id, name, email, phone)
  VALUES (@id, @name, @email, @phone)
`);

export const createUser = (args) => {
  const { name, email, phone } = args;

  let existing;
  try {
    existing = getUserByEmail(email);
  } catch {
    // falls-through
  }

  if (existing) {
    throw {
      code: -32010,
      message: 'Email already registered',
    };
  }

  const id = uuidv7();
  const user = {
    id: id,
    name: requireNonEmptyString('name', name),
    email: requireNonEmptyString('email', email),
    phone: requireNonEmptyString('phone', phone),
  };

  insertUser.run(user);
  return user;
};


