import db from '../index.js';
import debug from './log.js';

const log = debug.extend('games');

export const createGamesTable = () => {
  log('Creating games table');
  db.exec(`
    CREATE TABLE IF NOT EXISTS games (
      id           INTEGER PRIMARY KEY AUTOINCREMENT,
      title        TEXT NOT NULL,
      active       INTEGER NOT NULL DEFAULT 0 CHECK (active IN (0,1)),
      bonus_game   INTEGER NOT NULL DEFAULT 0 CHECK (bonus_game IN (0,1)),
      short_code   TEXT NOT NULL,
      CHECK (
        (active = 0 AND bonus_game IN (0,1)) OR
        (active = 1 AND bonus_game = 0)
      )
    );
  `);
  log('Games table created');
};
