import { requireLogin } from '../../auth.js';
import { createGameMethod } from './createGame.js';
import { listGamesMethod } from './listGames.js';
import { fetchGameMethod } from './fetchGame.js';
import { updateGameMethod } from './updateGame.js';
import { deleteGameMethod } from './deleteGame.js';
import { activateGameMethod } from './activateGame.js';
import { deactivateGameMethod } from './deactivateGame.js';
import { getActiveGameMethod } from './getActiveGame.js';
import { fetchGameDetailMethod } from './getGameDetail.js';

export const games = {
  create: requireLogin(createGameMethod, 'admin'),
  list: requireLogin(listGamesMethod, 'admin'),
  fetch: requireLogin(fetchGameMethod),
  detail: requireLogin(fetchGameDetailMethod, 'admin'),
  update: requireLogin(updateGameMethod, 'admin'),
  delete: requireLogin(deleteGameMethod, 'admin'),
  activate: requireLogin(activateGameMethod, 'admin'),
  deactivate: requireLogin(deactivateGameMethod, 'admin'),
  active: requireLogin(getActiveGameMethod),
};
