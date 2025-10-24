import db from '../../db/index.js';
import debug from './log.js';

const log = debug.extend('list');

export const listUsersStmt = db.prepare(`
  SELECT
    u.id AS userId,
    u.name,
    u.email,
    COALESCE(ts.total_points, 0) AS total_points,
    s.score_type AS scoreType,
    s.score_points AS scorePoints,
    s.id AS scoreId
  FROM users AS u
  LEFT JOIN (
    SELECT
      user_id,
      SUM(score_points) AS total_points
    FROM scores
    GROUP BY user_id
  ) AS ts
    ON ts.user_id = u.id
  LEFT JOIN scores AS s
    ON s.user_id = u.id
    AND s.game_id IS NULL
    AND s.answer_id IS NULL
  WHERE
    TRIM(:query) = ''
    OR (u.name LIKE '%' || :query || '%' OR u.email LIKE '%' || :query || '%')
  ORDER BY
    u.name COLLATE NOCASE
  LIMIT :limit OFFSET :offset;
`);

export const searchUsers = (args) => {
  log('Search Users', args);
  const {
    limit = 50,
    offset = 0,
    query = null,
  } = args ?? {};

  log(`Searching for users with query ${query} users starting from ${offset}`);
  const users = listUsersStmt.all({
    limit: Number(limit) || 50,
    offset: Number(offset) || 0,
    query: query ? String(query) : '',
  });
  log('Users', users);
  return { users, limit, offset };
};
