import db from '../../db/index.js';
import {
  requireNonEmptyString,
} from '../helpersAndGuards.js';
import { getGameById } from '../games/getGameById.js';
import { getLastQuestionForGame } from './getLastQuestionForGame.js';
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

const getNextSortOrder = (game) => {
  const lastQuestion = getLastQuestionForGame(game.id);
  log('last question', lastQuestion);
  return lastQuestion ? lastQuestion.sortOrder + 1 : 1;
};

export const insertQuestion = db.prepare(`
  INSERT INTO questions (
    game_id,
    question,
    choice_a,
    choice_b,
    choice_c,
    choice_d,
    correct_choice,
    sort_order
  )
  VALUES (
    @gameId,
    @question,
    @choiceA,
    @choiceB,
    @choiceC,
    @choiceD,
    @correctChoice,
    @sortOrder
  )
`);

export const createQuestion = (args = {}) => createQuestionsBatch(
  args.gameId, [
    {
      question: requireNonEmptyString('question', args.question),
      choiceA: requireNonEmptyString('coiceA', args.choiceA),
      choiceB: requireNonEmptyString('coiceB', args.choiceB),
      choiceC: requireNonEmptyString('coiceC', args.choiceC),
      choiceD: requireNonEmptyString('coiceD', args.choiceD),
      correctChoice: checkCorrectChoice(args.correctChoice),
    },
  ],
);

export const createQuestionsBatch = (gameId, questions = []) => {
  log(`Creating ${questions.length} questions for game ${gameId}`);

  const game = getGameById(gameId);
  const insert = insertQuestion;
  let nextSortOrder = getNextSortOrder(game);

  const insertMany = db.transaction((questionsArray) => {
    for (const question of questionsArray) {
      log('Next sort order', nextSortOrder);
      insert.run({
        gameId: game.id,
        question: requireNonEmptyString('question', question.question),
        choiceA: requireNonEmptyString('choiceA', question.choiceA),
        choiceB: requireNonEmptyString('choiceB', question.choiceB),
        choiceC: requireNonEmptyString('choiceC', question.choiceC),
        choiceD: requireNonEmptyString('choiceD', question.choiceD),
        correctChoice: checkCorrectChoice(question.correctChoice),
        sortOrder: nextSortOrder++,
      });
    }
  });

  insertMany(questions);
  log(`Inserted ${questions.length} questions successfully`);
  return { inserted: questions.length };
};
