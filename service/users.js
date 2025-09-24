import db from '../db/index.js';
import { v7 as uuidv7 } from 'uuid';
import { requireNonEmptyString, requireUuid } from './helpersAndGuards.js';

const insertUser = db.prepare(`
  INSERT INTO users (id, name, email, phone)
  VALUES (@id, @name, @email, @phone)
`);

const selectUserById = db.prepare(`
  SELECT id, name, email, phone
  FROM users
  WHERE id = ?
`);

const selectUserByEmail = db.prepare(`
  SELECT id, name, email, phone
  FROM users
  WHERE email = ?
`);

const deleteUserById = db.prepare('DELETE FROM users WHERE id = ?');

const listUsersStmt = db.prepare(`
  SELECT id, name, email, phone
  FROM users
  ORDER BY id ASC
  LIMIT @limit OFFSET @offset
`);

const countUsersStmt = db.prepare(`
  SELECT COUNT(1) AS total
  FROM users
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

export const getUserByEmail = (email) => {
  console.info('Get user by Email');
  if (!email) {
    throw {
      code: -32602,
      message: 'email is required',
    };
  }

  const user = selectUserByEmail.get(email) || null;

  if (!user) {
    console.debug('No user with that email');
    throw {
      code: -32004,
      message: 'User not found',
    };
  }

  return user;
};

export const removeUser = (id) => {
  console.info('Remove user');

  const existing = getUserById(id);
  deleteUserById.run(existing.id);
  return existing;
};

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

  const update = { ...existing };
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
    deleteUserById.run(update.id);
    insertUser.run(update);
    return true;
  })(update);

  return update;
};

export const listUsers = ({ limit = 50, offset = 0 } = {}) => {
  console.info('List users');
  const users = listUsersStmt.all({ limit, offset });
  const { total } = countUsersStmt.get();
  return { users, total: total, limit, offset };
};
