import db from '../index.js';
import debug from './log.js';

const log = debug.extend('questions');

export const createQuestionsTable = () => {
  log('Creating questions table');
  db.exec(`
    CREATE TABLE IF NOT EXISTS questions (
      id             INTEGER PRIMARY KEY AUTOINCREMENT,
      game_id        INTEGER NOT NULL,
      question       TEXT NOT NULL,
      choice_a       TEXT NOT NULL,
      choice_b       TEXT NOT NULL,
      choice_c       TEXT NOT NULL,
      choice_d       TEXT NOT NULL,
      correct_choice CHAR NOT NULL CHECK (correct_choice IN ('A','B','C','D')),
      sort_order     INTEGER NOT NULL DEFAULT 0
    );

    CREATE INDEX IF NOT EXISTS idx_questions_game_id ON questions(game_id);
    CREATE INDEX IF NOT EXISTS idx_questions_game_sort ON questions (game_id, sort_order);
  `);

  log('Created questions table');
};
