import db from '../../db/index.js';
import { requireNonEmptyString } from '../helpersAndGuards.js';
import { getUserById } from './getUserById.js';
import { insertUser } from './createUser.js';
import { deleteUser } from './deleteUser.js';
import { getUserByEmail } from './getUserByEmail.js';

export const updateUser = (id, patch = {}) => {
  console.info(`Update user ${id}`, patch);
  const existing = getUserById(id);
  console.debug('Existing user', existing);

  let check;
  try {
    check = getUserByEmail(patch.email);
  } catch {
    // falls-through
  }

  if (check && check.id !== id) {
    throw {
      code: -32010,
      message: 'Cannot update your email. Another user with that email is registered',
    };
  }

  const update = { };
  if ('name' in patch) {
    update.name = requireNonEmptyString('name', patch.name);
  }

  if ('email' in patch) {
    update.email = requireNonEmptyString('email', patch.email);
  }

  if ('phone' in patch) {
    update.phone = requireNonEmptyString('phone', patch.phone);
  }

  db.transaction((update) => {
    deleteUser.run(update.id);
    insertUser.run(update);
    return true;
  })(update);

  return update;
};
