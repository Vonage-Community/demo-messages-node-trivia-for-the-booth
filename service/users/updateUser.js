import db from '../../db/index.js';
import { requireNonEmptyString } from '../helpersAndGuards.js';
import { getUserById } from './getUserById.js';
import { getUserByEmail } from './getUserByEmail.js';
import debug from './log.js';

const log = debug.extend('update');

export const updateUserSmt = db.prepare(`
  UPDATE users
  SET
    name = COALESCE(@name, name),
    email = COALESCE(@email, email),
    phone = COALESCE(@phone, phone),
    notify = COALESCE(@notify, notify)
  WHERE id = @id
`);

export const updateUser = (id, patch) => {
  log(`Update user ${id}`, patch);
  getUserById(id);

  let check;
  try {
    check = getUserByEmail(patch.email);
  } catch {
    // falls-through
  }

  if (check && check.id !== id) {
    log('Other user has email');
    const message = 'Cannot update your email. Another user with that email is registered';
    throw {
      code: -32010,
      message: message,
      data: {
        email: message,
      },
    };
  }

  const update = { id: id };
  if ('name' in patch) {
    update.name = requireNonEmptyString('name', patch.name);
  }

  if ('email' in patch) {
    update.email = requireNonEmptyString('email', patch.email);
  }

  if ('phone' in patch) {
    update.phone = requireNonEmptyString('phone', patch.phone);
  }

  if ('notify' in patch) {
    update.notify = patch.notify ? 1 : 0;
  }

  updateUserSmt.run(update);
  log(`User ${id} updated`);
  return update;
};
