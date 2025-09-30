import db from '../../db/index.js';
import { getUserById } from './getUserById.js';

export const deleteUserById = db.prepare('DELETE FROM users WHERE id = ?');

export const deleteUser = (id) => {
  console.info('Remove user');

  const existing = getUserById(id);
  deleteUserById.run(existing.id);
  return existing;
};
