import db from '../../db/index.js';
import { getUserById } from './getUserById.js';
import debug from './log.js';

const log = debug.extend('delete');

export const deleteUserById = db.prepare('DELETE FROM users WHERE id = ?');

export const deleteUser = (id) => {
  log(`Removing user with id ${id}`);

  const existing = getUserById(id);
  deleteUserById.run(existing.id);
  return existing;
};
