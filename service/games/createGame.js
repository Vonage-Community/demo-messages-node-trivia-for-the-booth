import db from '../../db/index.js';
import { v7 as uuidv7 } from 'uuid';
import {
  toRowBoolean,
  requireNonEmptyString,
} from '../helpersAndGuards.js';

export const insertGame = db.prepare(`
  INSERT INTO games (id, title, active)
  VALUES (@id, @title, @active)
`);

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
