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
      COUNT(DISTINCT p.player_id) AS player_count
    FROM games g
    LEFT JOIN players p ON p.game_id = g.id
    LEFT JOIN questions q ON q.game_id = g.id
    GROUP BY g.id;
  `);

  log('Created games view');
};
