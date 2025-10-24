import { deleteScore } from '../../../service/players/deleteScore.js';
import debug from './log.js';

const log = debug.extend('delete');

export const deleteScoreMethod = async ({ id }) => {
  log('Deleting score', id);

  return deleteScore(id);
};
