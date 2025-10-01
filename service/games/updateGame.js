import db from '../../db/index.js';
import { getGameById } from './getGameById.js';
import {
  toRowBoolean,
  requireNonEmptyString,
} from '../helpersAndGuards.js';
import debug from './log.js';

const log = debug.extend('update');

export const updateGameById = db.prepare(`
  UPDATE games
  SET
    title = COALESCE(@title, title),
    active = COALESCE(@active, active)
  WHERE id = @id
`);

export const updateGame = (id, patch = {}) => {
  log(`Updating ${id}`);
  getGameById(id);
  const update = {};

  if ('title' in patch) {
    log('Updating title');
    update.title = requireNonEmptyString('title', patch.title);
  }

  update.active = toRowBoolean(update.active);

  updateGameById.run(update);
  log(`${id} updated`);
  return getGameById(update.id);
};
