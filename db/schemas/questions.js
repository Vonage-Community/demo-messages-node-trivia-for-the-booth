import db from '../index.js';
import debug from './log.js';

const log = debug.extend('questions');

export function createQuestionsTable() {
  log('Creating questions table');
  db.exec(`
    CREATE TABLE IF NOT EXISTS questions (
      id       TEXT PRIMARY KEY,
      game_id  TEXT NOT NULL,
      question TEXT NOT NULL,
      choice_a TEXT NOT NULL,
      choice_b TEXT NOT NULL,
      choice_c TEXT NOT NULL,
      choice_d TEXT NOT NULL,
      correct_choice CHAR NOT NULL CHECK (correct_choice IN ('a','b','c','d')),
      FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_questions_game_id ON questions(game_id);
  `);
  log('Created questions table');
}
