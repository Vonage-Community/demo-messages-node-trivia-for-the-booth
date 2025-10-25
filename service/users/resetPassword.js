import db from '../../db/index.js';
import { requireNonEmptyString } from '../helpersAndGuards.js';
import debug from './log.js';
import bcrypt from 'bcryptjs';

const log = debug.extend('create');

export const updateUserPassword = db.prepare(`
  UPDATE users
  SET
    password = @password
  WHERE id = @id
`);

export const resetPassword = (args) => {
  log('Resetting password');
  const { id, password } = args;

  const salt = bcrypt.genSaltSync(10);
  const user = {
    id: id,
    password: bcrypt.hashSync(
      requireNonEmptyString('password', password),
      salt,
    ),
  };

  const info = updateUserPassword.run(user);
  log('User password updated');
  return user;
};


