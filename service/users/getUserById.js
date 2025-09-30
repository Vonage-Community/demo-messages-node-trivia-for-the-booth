import db from '../../db/index.js';
import { requireUuid } from '../helpersAndGuards.js';

export const selectUserById = db.prepare(`
  SELECT id, name, email, phone
  FROM users
  WHERE id = ?
`);

export const getUserById = (id) => {
  requireUuid('id', id);
  const user = selectUserById.get(id) || null;

  if (!user) {
    throw {
      code: -32004,
      message: 'User not found',
    };
  }

  return user;
};
