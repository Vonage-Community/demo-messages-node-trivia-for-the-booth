import db from '../index.js';
import debug from './log.js';

const log = debug.extend('answers');

export const createAnswersTable = () => {
  log('Creating answers table');
  db.exec(`
    CREATE TABLE IF NOT EXISTS answers (
      id                  INTEGER PRIMARY KEY AUTOINCREMENT,
      game_id             INTEGER NOT NULL,
      question_id         INTEGER NOT NULL,
      player_id           INTEGER NOT NULL,
      player_answer       CHAR NOT NULL CHECK (player_answer IN ('A','B','C','D','N')),
      client_received_at  INTEGER,
      client_answered_at  INTEGER,
      server_received_at  INTEGER,
      response_time_ms    INTEGER,

      FOREIGN KEY (game_id)     REFERENCES games(id)     ON DELETE RESTRICT,
      FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE RESTRICT,
      FOREIGN KEY (player_id)   REFERENCES users(id)     ON DELETE CASCADE,

      UNIQUE (question_id, player_id)
    );

    CREATE INDEX IF NOT EXISTS idx_answers_game_id ON answers(game_id);
    CREATE INDEX IF NOT EXISTS idx_answers_player_id ON answers(player_id);
    CREATE INDEX IF NOT EXISTS idx_answers_question_id ON answers(question_id);
    CREATE INDEX IF NOT EXISTS idx_answers_game_question ON answers (game_id, question_id);

  `);
  log('Created answers table');
};
