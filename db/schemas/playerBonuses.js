import db from '../index.js';
import debug from './log.js';

const log = debug.extend('players:bonuses');

export const createPlayerBonusTable = () => {
  log('Creating player bonus table');
  db.exec(`
    CREATE TABLE IF NOT EXISTS player_bonuses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      game_id INTEGER NOT NULL,
      player_id INTEGER NOT NULL,
      bonus_type TEXT NOT NULL,
      bonus_points INTEGER NOT NULL,
      created_at INTEGER NOT NULL DEFAULT (strftime('%s','now')),
      FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE,
      FOREIGN KEY (player_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `);

  log('Created player bouns table');
};
