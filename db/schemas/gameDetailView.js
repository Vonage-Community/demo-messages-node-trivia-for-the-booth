import db from '../index.js';
import debug from './log.js';

const log = debug.extend('game:detail:view');

export const createGameDetailView = () => {
  log('Creating game_detail view');
  db.exec(`
    CREATE VIEW IF NOT EXISTS game_detail_view AS
    SELECT
      g.id                  AS game_id,
      g.title               AS game_title,
      g.short_code          AS short_code,
      g.active              AS active,
      q.id                  AS question_id,
      q.question            AS question_text,
      q.choice_a,
      q.choice_b,
      q.choice_c,
      q.choice_d,
      q.correct_choice,

      -- total number of players in the game
      (SELECT COUNT(DISTINCT p.player_id)
         FROM players p
        WHERE p.game_id = g.id) AS player_count,

      -- number of correct answers for this question
      (SELECT COUNT(*)
         FROM answers a
         JOIN users u ON a.player_id = u.id
        WHERE a.question_id = q.id
          AND a.answered_correctly = 1) AS correct_answer_count,

      -- answer counts per choice
      (SELECT COUNT(*)
         FROM answers a
         WHERE a.question_id = q.id AND a.player_answer = 'A') AS count_choice_a,
      (SELECT COUNT(*)
         FROM answers a
         WHERE a.question_id = q.id AND a.player_answer = 'B') AS count_choice_b,
      (SELECT COUNT(*)
         FROM answers a
         WHERE a.question_id = q.id AND a.player_answer = 'C') AS count_choice_c,
      (SELECT COUNT(*)
         FROM answers a
         WHERE a.question_id = q.id AND a.player_answer = 'D') AS count_choice_d,

      -- number of incorrect answers for this question
      (SELECT COUNT(*)
         FROM answers a
         JOIN users u ON a.player_id = u.id
        WHERE a.question_id = q.id
          AND a.answered_correctly = 0) AS incorrect_answer_count
    FROM games g
    JOIN questions q ON q.game_id = g.id;
  `);

  log('Created game_detail_view');
};
