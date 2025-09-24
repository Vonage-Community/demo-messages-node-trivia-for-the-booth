import { getGameById } from '../../../service/games.js';

export const fetchGameMethod = async ({ id }) => getGameById(id);

