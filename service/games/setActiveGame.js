import db from '../../db/index.js';
import { getGameById } from './getGameById.js';
import {
  requireUInt,
} from '../helpersAndGuards.js';
import { getActiveGame } from './getActiveGame.js';
import debug from './log.js';

const log = debug.extend('activate');

const deactivateAllActive = db.prepare('UPDATE games SET active = 0 WHERE active = 1');

const activateOne = db.prepare('UPDATE games SET active = 1 WHERE id = ?');

const setOnlyActiveTx = db.transaction((id) => {
  deactivateAllActive.run();

  const info = activateOne.run(id);
  if (info.changes === 0) {
    throw {
      code: -32004,
      message: 'Failed to activate game',
    };
  }
});

export const setActiveGame = (id) => {
  log(`Activating ${id}`);
  requireUInt('id', id);

  let current;
  getGameById(id);

  try {
    current = getActiveGame();
    if (current?.id === id) {
      return current;
    }
  } catch {
    // falls-through
  }

  setOnlyActiveTx(id);
  log(`${id} active`);
  return getActiveGame();
};
