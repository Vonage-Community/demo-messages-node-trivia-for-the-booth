import db from '../db/index.js';
import { v7 as uuidv7 } from 'uuid';
import {
  toRowBoolean,
  requireNonEmptyString,
  requireUuid,
} from './helpersAndGuards.js';
import { getGameById } from './games.js';

const insertQuestion = db.prepare(`
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
    correctChoice: requireNonEmptyString('correctChoice', correctChoice),
  };

  console.debug('Question to create', questionToCreate);

  insertQuestion.run(question);

  return question;
};
