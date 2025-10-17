import db from '../index.js';
import debug from './log.js';

const log = debug.extend('players:scores:view');

export const createPlayerScoresView = () => {
  log('Creating player scores view');
  db.exec(`
    CREATE VIEW IF NOT EXISTS player_scores AS
    SELECT
      g.id AS game_id,
      g.title AS game_title,
      u.id AS player_id,
      u.name AS player_name,

      -- total number of questions answered correctly
      SUM(CASE WHEN awc.answered_correctly = 1 THEN 1 ELSE 0 END) AS correct_points,

      -- total number of incorrect answers (ignores 'N')
      SUM(CASE WHEN awc.answered_correctly = 0 AND awc.player_answer != 'N' THEN 1 ELSE 0 END) AS incorrect_answers,

      -- total number of questions actually answered (A–D)
      SUM(CASE WHEN awc.player_answer != 'N' THEN 1 ELSE 0 END) AS questions_answered,

      -- average response time (exclude unanswered)
      ROUND(AVG(CASE WHEN awc.player_answer != 'N' THEN awc.response_time_ms END)) AS avg_response_time_ms,

      -- total bonus points from player_bonuses
      COALESCE(SUM(DISTINCT pb_total.total_bonus_points), 0) AS bonus_points,

      -- total points = correct + bonuses
      (SUM(CASE WHEN awc.answered_correctly = 1 THEN 1 ELSE 0 END)
      + COALESCE(SUM(DISTINCT pb_total.total_bonus_points), 0)
      ) AS total_points

    FROM games g
    JOIN questions q ON q.game_id = g.id
    JOIN answers_with_correctness awc ON awc.question_id = q.id
    JOIN users u ON u.id = awc.player_id

    -- total up bonuses per player/game first, so we don't overcount
    LEFT JOIN (
      SELECT
        game_id,
        player_id,
        SUM(bonus_points) AS total_bonus_points
      FROM player_bonuses
      GROUP BY game_id, player_id
    ) pb_total
      ON pb_total.game_id = g.id
      AND pb_total.player_id = awc.player_id

    GROUP BY g.id, u.id;
  `);

  log('Created player scores view');
};
