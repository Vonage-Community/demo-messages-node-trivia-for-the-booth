import db from '../index.js';
import debug from './log.js';

const log = debug.extend('prizes');

export const createPrizesTable = () => {
  log('Creating prizes table');
  db.exec(`
    CREATE TABLE IF NOT EXISTS prizes (
      game_id      INTEGER NOT NULL,
      player_id    INTEGER NOT NULL,
      prize        TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_prizes_game_id ON prizes(game_id);
  `);

  log('Created prizes table');
};
