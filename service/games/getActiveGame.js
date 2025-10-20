import db from '../../db/index.js';
import { isPlayerPlayingGame } from '../players/isPlayerPlayingGame.js';
import { gameFromRow } from './gameFromRow.js';
import { checkForNextQuestionStmt } from '../players/submitAnswerForPlayer.js';
import debug from './log.js';

const log = debug.extend('active');

export const selectActive = db.prepare(`
    SELECT
      g.id,
      g.title,
      g.active,
      g.short_code,
      g.bonus_game,
      COUNT(q.id) AS question_count
    FROM games g
    LEFT JOIN questions q ON q.game_id = g.id
    WHERE g.active = 1
    GROUP BY g.id
    LIMIT 1
  `);

export const getActiveGame = (args) => {
  log('Fetching active');
  const activeGame = gameFromRow(selectActive.get());

  if (!activeGame) {
    log('No active game found');
    throw {
      code: -32004,
      message: 'No active game found',
    };
  }

  const isPlayerPlaying = isPlayerPlayingGame({
    gameId: activeGame.id,
    playerId: args?._auth?.id,
  });

  log(`${activeGame.id} Active`);

  const { has_next_question: hasNextQuestion } = checkForNextQuestionStmt.get({
    gameId: activeGame.id,
    playerId: args?._auth?.id,
  });

  log('Has next question', hasNextQuestion);
  return {
    ...activeGame,
    playing: isPlayerPlaying,
    hasNext: !!hasNextQuestion,
  };
};
