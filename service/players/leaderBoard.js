import db from '../../db/index.js';
import debug from './log.js';

const log = debug.extend('leaderboard');

const leaderboardStmt = db.prepare(`
  SELECT
    DENSE_RANK() OVER (ORDER BY SUM(s.score_points) DESC) AS rank,
    u.id AS userId,
    u.name,
    s.game_id AS gameId,
    g.title,
    SUM(s.score_points) AS totalPoints
  FROM scores s
  JOIN users u ON s.user_id = u.id
  LEFT JOIN games g ON s.game_id = g.id
  GROUP BY s.user_id
  ORDER BY totalPoints DESC;
`);

export const leaderboard = () => {
  log('Loading Leaderboard');
  const rows = leaderboardStmt.all();

  return rows;
};
