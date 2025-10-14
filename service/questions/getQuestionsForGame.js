import db from '../../db/index.js';
import {
  requireUInt,
} from '../helpersAndGuards.js';
import { fromQuestionRow } from './fromQuestionRow.js';
import debug from './log.js';

const log = debug.extend('list');

const listGamesStmt = db.prepare(`
  SELECT id, game_id, question, choice_a, choice_b, choice_c, choice_d
  FROM questions
  WHERE game_id = ?
`);

export const getQuestionsForGame = (gameId) => {
  log(`Fetching questions for game ${gameId}`);
  requireUInt('gameId', gameId);
  return listGamesStmt.all(gameId).map(fromQuestionRow);
};
