import db from '../index.js';
import debug from './log.js';

const log = debug.extend('answer:correct:view');

export const createCorrectAnswersView = () => {
  log('Creating correct answers view');
  db.exec(`
    CREATE VIEW IF NOT EXISTS answers_with_correctness AS
    SELECT
      a.id,
      a.game_id,
      a.question_id,
      a.player_id,
      a.player_answer,
      q.correct_choice,
      CASE
        WHEN a.player_answer = 'N' THEN 0         -- not answered yet
        WHEN a.player_answer = q.correct_choice THEN 1
        ELSE 0
      END AS answered_correctly,
      a.client_received_at,
      a.client_answered_at,
      a.server_received_at,
      a.response_time_ms
    FROM answers a
    JOIN questions q ON a.question_id = q.id;
  `);

  log('Created correct answers view');
};
