import db from '../index.js';
import debug from './log.js';

const log = debug.extend('games');

export function createGamesTable() {
  log('Creating games table');
  db.exec(`
    CREATE TABLE IF NOT EXISTS games (
      id                  INTEGER PRIMARY KEY AUTOINCREMENT,
      title               TEXT NOT NULL,
      active              INTEGER NOT NULL DEFAULT 0
    );
  `);
  log('Games table created');
}
