import db from '../../db/index.js';
import {
  requireNonEmptyString,
} from '../helpersAndGuards.js';
import { gameFromRow } from './gameFromRow.js';
import debug from './log.js';

const log = debug.extend('create');

const generateShortCode = () => {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += letters.charAt(Math.floor(Math.random() * letters.length));
  }
  return code;
};


export const insertGame = db.prepare(`
  INSERT INTO games (title, active, short_code, bonus_game)
  VALUES (@title, @active, @shortCode, @bonusGame)
`);

export const createGame = (args = {}) => {
  log('Creating', args);

  const {
    title,
    bonusGame,
  } = args;

  const game = {
    title: requireNonEmptyString('title', title),
    shortCode: generateShortCode(),
    active: 0,
    bonusGame: bonusGame ? 1 : 0,
  };

  log('Game to create', game);

  const info = insertGame.run(game);
  game.id = info.lastInsertRowid;
  log(`"${game.title}" created with id ${game.id}`);

  return gameFromRow(game);
};
