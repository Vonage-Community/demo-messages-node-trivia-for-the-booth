import { createGameMethod } from './createGame.js';
import { listGamesMethod } from './listGames.js';
import { fetchGameMethod } from './fetchGame.js';
import { updateGameMethod } from './updateGame.js';
import { deleteGameMethod } from './deleteGame.js';
import { activateGameMethod } from './activateGame.js';
import { deactivateGameMethod } from './deactivateGame.js';
import { getActiveGameMethod } from './getActiveGame.js';

export const games = {
  create: createGameMethod,
  list: listGamesMethod,
  fetch: fetchGameMethod,
  update: updateGameMethod,
  delete: deleteGameMethod,
  activate: activateGameMethod,
  deactivate: deactivateGameMethod,
  active: getActiveGameMethod,
};
