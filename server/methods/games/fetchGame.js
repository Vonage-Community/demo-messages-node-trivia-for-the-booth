import { getGameDetail } from '../../../service/games.js';
import debug from './log.js';

const log = debug.extend('fetch');

export const fetchGameMethod = async ({ id }) => {
  log(`Fetching game ${id}`);
  return getGameDetail(id);
};

