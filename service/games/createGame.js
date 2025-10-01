import db from '../../db/index.js';
import { v7 as uuidv7 } from 'uuid';
import {
  toRowBoolean,
  requireNonEmptyString,
} from '../helpersAndGuards.js';
import debug from './log.js';

const log = debug.extend('create');

export const insertGame = db.prepare(`
  INSERT INTO games (id, title, active)
  VALUES (@id, @title, @active)
`);

export const createGame = (args) => {
  log('Creating', args);

  const {
    title,
    active = false,
  } = args;

  const id = uuidv7();
  const game = {
    id,
    title: requireNonEmptyString('title', title),
    active: toRowBoolean(active),
  };

  insertGame.run(game);
  log(`"${game.title}" created with id ${game.id}`);

  return game;
};
