import db from '../index.js';
import debug from './log.js';

const log = debug.extend('scores');

export const createScoresTable = () => {
  log('Creating scores table');
  db.exec(`
    CREATE TABLE IF NOT EXISTS scores (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      game_id INTEGER,
      answer_id INTEGER,
      user_id INTEGER NOT NULL,
      score_type TEXT NOT NULL,
      score_points INTEGER NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_user_id ON scores(user_id);
    CREATE INDEX IF NOT EXISTS idx_game_id ON scores(game_id);
    CREATE INDEX IF NOT EXISTS idx_answers_id ON scores(answer_id);
  `);

  log('Created scores table');
};
