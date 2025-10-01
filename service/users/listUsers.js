import db from '../../db/index.js';
import debug from './log.js';

const log = debug.extend('list');

export const listUsersStmt = db.prepare(`
  SELECT id, name, email, phone
  FROM users
  ORDER BY id ASC
  LIMIT @limit OFFSET @offset
`);

export const countUsersStmt = db.prepare(`
  SELECT COUNT(1) AS total
  FROM users
`);

export const listUsers = ({ limit = 50, offset = 0 } = {}) => {
  log(`Listing ${limit} users starting from ${offset}`);
  const users = listUsersStmt.all({ limit, offset });
  const { total } = countUsersStmt.get();
  log(`Found ${total} users`);
  return { users, total: total, limit, offset };
};
