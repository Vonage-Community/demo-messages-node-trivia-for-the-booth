import db from '../../db/index.js';

export const createUsersTable = () => {
  console.debug('Creating users table');
  db.exec(`
    CREATE TABLE IF NOT EXISTS users(
      id          TEXT    PRIMARY KEY,
      name        TEXT    NOT NULL,
      email       TEXT    NOT NULL UNIQUE,
      phone       TEXT
    );
  
    CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);`,
  );
  console.debug('Users table created');
};
