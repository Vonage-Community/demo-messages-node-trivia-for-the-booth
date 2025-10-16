import db from '../../db/index.js';
import {
  requireNonEmptyString,
} from '../helpersAndGuards.js';
import { getGameById } from '../games.js';
import debug from './log.js';

const log = debug.extend('create');

export const checkCorrectChoice = (correct) => {
  if (['A', 'B', 'C', 'D'].includes(String(correct).toUpperCase())) {
    return correct;
  }
  throw {
    code: -32602,
    message: `${correct} is not a correct choice`,
  };
};

export const insertQuestion = db.prepare(`
  INSERT INTO questions (game_id, question, choice_a, choice_b, choice_c, choice_d, correct_choice)
  VALUES (@gameId, @question, @choiceA, @choiceB, @choiceC, @choiceD, @correctChoice)
`);

export const createQuestion = (args = {}) => {
  log('Creating question', args);

  const game = getGameById(args.gameId);
  const question = {
    gameId: game.id,
    question: requireNonEmptyString('question', args.question),
    choiceA: requireNonEmptyString('coiceA', args.choiceA),
    choiceB: requireNonEmptyString('coiceB', args.choiceB),
    choiceC: requireNonEmptyString('coiceC', args.choiceC),
    choiceD: requireNonEmptyString('coiceD', args.choiceD),
    correctChoice: checkCorrectChoice(args.correctChoice),
  };
  log('Question to create', question);

  const info = insertQuestion.run(question);
  question.id = info.lastInsertRowid;

  log('Question created');
  return question;
};
