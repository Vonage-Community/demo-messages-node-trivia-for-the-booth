import { deactivateGame } from '../../../service/games.js';

export const deactivateGameMethod = async ({ id }) => deactivateGame(id);
