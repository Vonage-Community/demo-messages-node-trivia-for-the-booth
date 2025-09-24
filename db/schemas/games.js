import db from '../index.js';

export function createGamesTable() {
  console.debug('Creating games table');
  db.exec(`
    CREATE TABLE IF NOT EXISTS games (
      id                  TEXT PRIMARY KEY,
      title               TEXT NOT NULL,
      active              INTEGER NOT NULL DEFAULT 0
    );
  `);
  console.debug('Games table created');
}
