import { updateGame } from '../../../service/games.js';

export const updateGameMethod = async ({ id, ...args }) => await updateGame(id, args);

