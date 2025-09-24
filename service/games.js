import db from '../db/index.js';
import { v7 as uuidv7 } from 'uuid';
import {
  toRowBoolean,
  requireNonEmptyString,
  requireUuid,
} from './helpersAndGuards.js';

const fromRow = (row) => row
  ? {
    id: row.id,
    title: row.title,
    active: !!row.active,
  }
  : null;

const insertGame = db.prepare(`
  INSERT INTO games (id, title, active)
  VALUES (@id, @title, @active)
`);

const selectGameById = db.prepare(`
  SELECT id, title, active
  FROM games
  WHERE id = ?
`);

const deleteGameById = db.prepare(`
  DELETE FROM games WHERE id = ?
`);

const updateGameById = db.prepare(`
  UPDATE games
  SET
    title = COALESCE(@title, title),
    active = COALESCE(@active, active)
  WHERE id = @id
`);

const listGamesStmt = db.prepare(`
  SELECT id, title, active
  FROM games
  ORDER BY id ASC
  LIMIT @limit OFFSET @offset
`);

const deactivateAllActive = db.prepare('UPDATE games SET active = 0 WHERE active = 1');

const activateOne = db.prepare('UPDATE games SET active = 1 WHERE id = ?');

const selectActive = db.prepare(`
    SELECT id, title, active
    FROM games
    WHERE active = 1
    LIMIT 1
  `);

const setOnlyActiveTx = db.transaction((id) => {
  deactivateAllActive.run();

  const info = activateOne.run(id);
  if (info.changes === 0) {
    throw { code: -32004, message: 'Game not found' };
  }
});

export const createGame = (args) => {
  console.info('Creating game', args);

  const {
    title,
    active = false,
  } = args;

  requireNonEmptyString('title', title);

  const id = uuidv7();
  const game = {
    id,
    title: requireNonEmptyString('title', title),
    active: toRowBoolean(active),
  };

  console.debug('Game to create', game);

  insertGame.run(game);

  return game;
};

export const getGameById = (id) => {
  requireUuid('id', id);
  const game = selectGameById.get(id) || null;

  console.debug('Game', game);

  if (!game) {
    throw {
      code: -32004,
      message: 'Game not found',
    };
  }

  return fromRow(game);
};

export const updateGame = (id, patch = {}) => {
  console.info(`Updating game ${id}`, patch);
  const existing = getGameById(id);
  const update = { ...existing };

  if ('title' in patch) {
    update.title = requireNonEmptyString('title', patch.title);
  }

  update.active = toRowBoolean(update.active);

  console.debug('Updates for game', update);
  updateGameById.run(update);
  return fromRow(update);
};

export const deleteGame = (id) => {
  const existing = getGameById(id);
  deleteGameById.run(id);
  return existing;
};

export const listGames = ({ limit = 50, offset = 0 } = {}) => {
  limit = Number.isFinite(limit) ? Number(limit) : 50;
  offset = Number.isFinite(offset) ? Number(offset) : 0;

  const rows = listGamesStmt.all({ limit: limit, offset: offset });

  return {
    games: rows.map(fromRow),
    limit: limit,
    offset: offset,
  };
};

export const setActiveGame = (id) => {
  requireUuid('id', id);

  let current;

  try {
    current = getActiveGame();
    if (current?.id === id) {
      return current;
    }
  } catch {
    // falls-through
  }

  setOnlyActiveTx(id);
  return getGameById(id);
};

export const deactivateGame = () => {
  const game = getActiveGame();

  if (!game.active) {
    return game;
  }

  game.active = 0;
  updateGameById.run(game);
  return fromRow(game);
};

export const getActiveGame = () => {
  const activeGame = fromRow(selectActive.get());

  if (!activeGame) {
    throw {
      code: -32004,
      message: 'No active game found',
    };
  }

  return activeGame;
};

