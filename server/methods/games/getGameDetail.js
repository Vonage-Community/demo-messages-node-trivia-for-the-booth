import { getGameDetail } from '../../../service/games.js';
import debug from './log.js';

const log = debug.extend('fetch_detail');

export const fetchGameDetailMethod = async ({ id }) => {
  log(`Fetching game details ${id}`);
  return getGameDetail(id);
};

