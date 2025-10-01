import db from '../../db/index.js';
import debug from './log.js';

const log = debug.extend('users');

export const createUsersTable = () => {
  log('Creating users table');
  db.exec(`
    CREATE TABLE IF NOT EXISTS users(
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      name        TEXT NOT NULL,
      email       TEXT NOT NULL UNIQUE,
      phone       TEXT
    );
  
    CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);`,
  );
  log('Users table created');
};
