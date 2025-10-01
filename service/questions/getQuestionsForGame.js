import db from '../../db/index.js';
import {
  requireUuid,
} from '../helpersAndGuards.js';
import debug from './log.js';

const log = debug.extend('list');

const listGamesStmt = db.prepare(`
  SELECT id, game_id, question, choice_a, choice_b, choice_c, choice_d, correct_choice
  FROM questions
  WHERE game_id = ?
`);

export const getQuestionsForGame = (gameId) => {
  log(`Listing questions for game ${gameId}`);
  requireUuid('gameId', gameId);
  return listGamesStmt.all(gameId);
};
