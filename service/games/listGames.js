import db from '../../db/index.js';
import { gameFromRow } from './gameFromRow.js';
import debug from './log.js';

const log = debug.extend('list');

const listGamesStmt = db.prepare(`
  SELECT
    id,
    title,
    active,
    short_code,
    question_count,
    player_count
  FROM games_with_counts
  ORDER BY id ASC
  LIMIT @limit OFFSET @offset
`);

export const countGamesStmt = db.prepare(`
  SELECT COUNT(1) AS total
  FROM games
`);

export const listGames = ({ limit = 50, offset = 0 } = {}) => {
  log(`Listing ${limit} starting from ${offset}`);
  limit = Number.isFinite(limit) ? Number(limit) : 50;
  offset = Number.isFinite(offset) ? Number(offset) : 0;

  const rows = listGamesStmt.all({ limit: limit, offset: offset });
  const { total } = countGamesStmt.get();
  log(`Found ${total} games`);

  return {
    games: rows.map(gameFromRow),
    limit: limit,
    total: total,
    offset: offset,
  };
};
