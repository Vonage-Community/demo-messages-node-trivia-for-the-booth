import db from '../../db/index.js';
import { v7 as uuidv7 } from 'uuid';
import {
  requireNonEmptyString,
} from '../helpersAndGuards.js';
import { getGameById } from '../games.js';

export const checkCorrectChoice = (correct) => {
  if (['A', 'B', 'C', 'D'].includes(String(correct).toUpperCase())) {
    return correct;
  }
  throw {
    code: -32602,
    message: `${correct} is not a correct value`,
  };
};

export const insertQuestion = db.prepare(`
  INSERT INTO questions (id, game_id, question, choice_a, choice_b, choice_c, choice_d, correct_choice)
  VALUES (@id, @gameId, @question, @choiceA, @choiceB, @choiceC, @choiceD, @correctChoice)
`);

export const createQuestion = (args) => {
  console.info('Creating question', args);

  const {
    gameId,
    question,
    choiceA,
    choiceB,
    choiceC,
    choiceD,
    correctChoice,
  } = args;

  getGameById(gameId);

  const id = uuidv7();
  const questionToCreate = {
    id,
    gameId,
    choiceA: requireNonEmptyString('coiceA', choiceA),
    choiceB: requireNonEmptyString('coiceB', choiceB),
    choiceC: requireNonEmptyString('coiceC', choiceC),
    choiceD: requireNonEmptyString('coiceD', choiceD),
    correctChoice: requireNonEmptyString('correctChoice', correctChoice) & checkCorrectChoice(correctChoice),
  };

  console.debug('Question to create', questionToCreate);

  insertQuestion.run({
    id: id,
    ...question,
  });

  return question;
};
