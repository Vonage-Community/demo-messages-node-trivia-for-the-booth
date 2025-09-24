import { setActiveGame } from '../../../service/games.js';

export const activateGameMethod = async ({ id }) => setActiveGame(id);
