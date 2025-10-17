import db from '../index.js';
import debug from './log.js';

const log = debug.extend('game:view');

export const createGamesView = () => {
  log('Creating games view');
  db.exec(`
    CREATE VIEW IF NOT EXISTS games_with_counts AS
    SELECT
      g.*,
      COUNT(DISTINCT q.id) AS question_count,
      COUNT(DISTINCT p.player_id) AS player_count,

      -- total number of correct answers for this game
      COALESCE(SUM(
        CASE
          WHEN awc.answered_correctly = 1 THEN 1
          ELSE 0
        END
      ), 0) AS total_correct_answers,

      -- total number of incorrect answers for this game
      COALESCE(SUM(
        CASE
          WHEN awc.answered_correctly = 0 AND awc.player_answer != 'N' THEN 1
          ELSE 0
        END
      ), 0) AS total_incorrect_answers

    FROM games g
    LEFT JOIN questions q ON q.game_id = g.id
    LEFT JOIN answers_with_correctness awc ON awc.question_id = q.id
    LEFT JOIN players p ON p.game_id = g.id
    GROUP BY g.id;
  `);

  log('Created games view');
};
