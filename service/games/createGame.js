import db from '../../db/index.js';
import {
  requireNonEmptyString,
} from '../helpersAndGuards.js';
import { gameFromRow } from './gameFromRow.js';
import debug from './log.js';

const log = debug.extend('create');

export const insertGame = db.prepare(`
  INSERT INTO games (title, active)
  VALUES (@title, @active)
`);

export const createGame = (args = {}) => {
  log('Creating', args);

  const {
    title,
  } = args;

  const game = {
    title: requireNonEmptyString('title', title),
    active: 0,
  };

  const info = insertGame.run(game);
  game.id = info.lastInsertRowid;
  log(`"${game.title}" created with id ${game.id}`);

  return gameFromRow(game);
};
