import db from '../index.js';
import debug from './log.js';

const log = debug.extend('games');

export const createGamesTable = () => {
  log('Creating games table');
  db.exec(`
    CREATE TABLE IF NOT EXISTS games (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      title      TEXT NOT NULL,
      active     INTEGER NOT NULL DEFAULT 0,
      bonus_game INTEGER NOT NULL DEFAULT 0,
      short_code TEXT NOT NULL
    );
  `);
  log('Games table created');
};
