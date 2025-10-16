import { getGameById } from '../../../service/games.js';
import debug from './log.js';

const log = debug.extend('fetch');

export const fetchGameMethod = async (args) => {
  const { id, _auth: auth } = args;
  log(`Fetching game ${id}`);
  return getGameById(id, auth.role === 'admin');
};

