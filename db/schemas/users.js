import db from '../../db/index.js';
import debug from './log.js';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const log = debug.extend('users');

export const createUsersTable = () => {
  log('Creating users table');
  db.exec(`
    CREATE TABLE IF NOT EXISTS users(
      id       INTEGER PRIMARY KEY AUTOINCREMENT,
      name     TEXT NOT NULL,
      password TEXT NOT NULL,
      email    TEXT NOT NULL UNIQUE,
      phone    TEXT,
      role     TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin'))
    );

    CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);`,
  );
  log('Users table created');

  if (!process.env.TRIVIA_ADMIN_EMAIL || !process.env.TRIVIA_ADMIN_PASSWORD) {
    log('Not creating admin user. Check the .env');
    return;

  }

  log('Creating admin user');
  const insertUser = db.prepare(`
    REPLACE INTO users (name, password, email, role)
    VALUES (@name, @password, @email, 'admin')
  `);

  const salt = bcrypt.genSaltSync(10);

  const user = {
    name: process.env.TRIVIA_ADMIN_EMAIL,
    email: process.env.TRIVIA_ADMIN_EMAIL,
    password: bcrypt.hashSync(
      process.env.TRIVIA_ADMIN_PASSWORD,
      salt,
    ),
  };

  insertUser.run(user);
  log('Admin user created');
};
