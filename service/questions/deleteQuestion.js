import db from '../../db/index.js';
import { getQuestionById } from './getQuestionById.js';
import debug from './log.js';

const log = debug.extend('delete');

export const deleteQuestionById = db.prepare(`
  DELETE FROM questions WHERE id = ?
`);

export const deleteQuestion = (id) => {
  log(`Deleting question ${id}`);
  const existing = getQuestionById(id);
  try {
    deleteQuestionById.run(id);
    log(`Question ${id} deleted`);
    return existing;
  } catch (error) {
    if (error.code === 'SQLITE_CONSTRAINT_FOREIGNKEY' || /FOREIGN KEY/.test(error.message)) {
      log(`Blocked deletion of question ${id} because answers exist`);
      throw {
        code: -32050,
        message: 'Cannot delete question: one or more players have already answered it.',
        data: { questionId: id },
      };
    }

    log(`Unexpected error deleting question ${id}: ${error.message}`);
    throw {
      code: -32099,
      message: 'Unexpected database error while deleting question.',
      data: { error: error.message, questionId: id },
    };
  }
};
