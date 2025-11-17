import db from '../index.js';
import debug from './log.js';

const log = debug.extend('players');

export const createPlayersTable = () => {
  log('Creating players table');
  db.exec(`
    CREATE TABLE IF NOT EXISTS players (
      game_id      INTEGER NOT NULL,
      player_id    INTEGER NOT NULL,
      started_at   INTEGER DEFAULT (strftime('%s','now')),
      completed_at INTEGER
    );

    CREATE INDEX IF NOT EXISTS idx_players_game_id ON players(game_id);;
  `);

  log('Created players table');
};
