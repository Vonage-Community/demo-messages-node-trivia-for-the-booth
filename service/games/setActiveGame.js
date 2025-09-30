import db from '../../db/index.js';
import { getGameById } from './getGameById.js';
import {
  requireUuid,
} from '../helpersAndGuards.js';
import { getActiveGame } from './getActiveGame.js';

const deactivateAllActive = db.prepare('UPDATE games SET active = 0 WHERE active = 1');

const activateOne = db.prepare('UPDATE games SET active = 1 WHERE id = ?');

const setOnlyActiveTx = db.transaction((id) => {
  deactivateAllActive.run();

  const info = activateOne.run(id);
  if (info.changes === 0) {
    throw { code: -32004, message: 'Game not found' };
  }
});

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
