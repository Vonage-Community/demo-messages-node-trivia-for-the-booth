import { deleteGame } from '../../../service/games.js';

export const deleteGameMethod = async ({ id }) => deleteGame(id);
