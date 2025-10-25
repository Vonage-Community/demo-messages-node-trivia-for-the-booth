import { getGameById } from '../../../service/games/getGameById.js';
import { isPlayerPlayingGame } from '../../../service/players/isPlayerPlayingGame.js';
import debug from './log.js';

const log = debug.extend('fetch');

export const fetchGameMethod = async (args) => {
  const { id, _auth: auth } = args;
  log(`Fetching game ${id}`);

  const game = getGameById(id, auth.role === 'admin');
  const isPlayerPlaying = isPlayerPlayingGame({
    gameId: game.id,
    playerId: args?._auth?.id,
  });

  return {
    ...game,
    playing: isPlayerPlaying,
  };
};

