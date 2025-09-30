import db from '../../db/index.js';
import { gameFromRow } from './gameFromRow.js';

const listGamesStmt = db.prepare(`
  SELECT id, title, active
  FROM games
  ORDER BY id ASC
  LIMIT @limit OFFSET @offset
`);

export const listGames = ({ limit = 50, offset = 0 } = {}) => {
  limit = Number.isFinite(limit) ? Number(limit) : 50;
  offset = Number.isFinite(offset) ? Number(offset) : 0;

  const rows = listGamesStmt.all({ limit: limit, offset: offset });

  return {
    games: rows.map(gameFromRow),
    limit: limit,
    offset: offset,
  };
};
