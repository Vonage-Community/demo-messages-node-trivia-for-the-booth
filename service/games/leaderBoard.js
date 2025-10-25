import db from '../../db/index.js';
import { getGameById } from './getGameById.js';
import debug from './log.js';

const log = debug.extend('list');

const gameLeaderboardStmt = db.prepare(`
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
  WHERE g.id = ?
  GROUP BY s.user_id
  ORDER BY totalPoints DESC;
`);

export const gameLeaderboard = (gameId) => {
  log(`Getting leaderboard for game ${gameId}`);
  const game = getGameById(gameId);

  const rows = gameLeaderboardStmt.all(game.id);

  return rows;
};
