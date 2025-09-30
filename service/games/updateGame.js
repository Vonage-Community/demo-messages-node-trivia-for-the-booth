import db from '../../db/index.js';
import { getGameById } from './getGameById.js';
import {
  toRowBoolean,
  requireNonEmptyString,
} from '../helpersAndGuards.js';

export const updateGameById = db.prepare(`
  UPDATE games
  SET
    title = COALESCE(@title, title),
    active = COALESCE(@active, active)
  WHERE id = @id
`);

export const updateGame = (id, patch = {}) => {
  console.info(`Updating game ${id}`, patch);
  getGameById(id);
  const update = { };

  if ('title' in patch) {
    update.title = requireNonEmptyString('title', patch.title);
  }

  update.active = toRowBoolean(update.active);

  console.debug('Updates for game', update);
  updateGameById.run(update);
  return getGameById(update.id);
};
