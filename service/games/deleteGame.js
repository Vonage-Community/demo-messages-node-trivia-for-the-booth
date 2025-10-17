import db from '../../db/index.js';
import { getGameById } from './getGameById.js';
import debug from './log.js';

const log = debug.extend('delete');

export const deleteGameById = db.prepare(`
  DELETE FROM games WHERE id = ?
`);

export const deleteGame = (id) => {
  log(`Deleting ${id}`);
  const existing = getGameById(id);
  try {
    deleteGameById.run(id);
    log(`${id} deleted`);
    return existing;
  } catch (error) {
    if (error.code === 'SQLITE_CONSTRAINT_FOREIGNKEY' || /FOREIGN KEY/.test(error.message)) {
      log(`Blocked deletion of game ${id} because answers exist`);
      throw {
        code: -32051,
        message: 'Cannot delete game: one or more players have submitted answers for this game.',
        data: { gameId: id },
      };
    }

    log(`Unexpected error deleting game ${id}: ${error.message}`);
    throw {
      code: -32099,
      message: 'Unexpected database error while deleting game.',
      data: { error: error.message, gameId: id },
    };
  }
};

