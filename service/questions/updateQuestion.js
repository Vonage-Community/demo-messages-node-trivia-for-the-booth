import db from '../../db/index.js';
import {
  requireNonEmptyString,
} from '../helpersAndGuards.js';
import { getQuestionById } from './getQuestionById.js';
import { checkCorrectChoice } from './createQuestion.js';
import debug from './log.js';

const log = debug.extend('update');

export const updateQuestionStmt = db.prepare(`
  UPDATE questions
  SET
    question = COALESCE(@question, question),
    choice_a = COALESCE(@choice_a, choice_a),
    choice_b = COALESCE(@choice_b, choice_b),
    choice_c = COALESCE(@choice_c, choice_c),
    choice_d = COALESCE(@choice_d, choice_d),
    correct_choice = COALESCE(@correct_choice, correct_choice)
  WHERE id = @id
`);

export const updateQuestion = (id, patch) => {
  log(`Updating question ${id}`, patch);
  getQuestionById(id);
  const update = { id: id };

  if ('question' in patch) {
    update.question = requireNonEmptyString('question', patch.question);
  }

  if ('choiceA' in patch) {
    update.choice_a = requireNonEmptyString('choiceA', patch.choiceA);
  }

  if ('choiceB' in patch) {
    update.choice_b = requireNonEmptyString('choiceB', patch.choiceB);
  }

  if ('choiceC' in patch) {
    update.choice_c = requireNonEmptyString('choiceC', patch.choiceC);
  }

  if ('choiceD' in patch) {
    update.choice_d = requireNonEmptyString('choiceD', patch.choiceD);
  }

  if ('correctChoice' in patch) {
    update.correct_choice = checkCorrectChoice(patch.correctChoice);
  }

  log(`Question ${id} updates`, update);
  updateQuestionStmt.run(update);

  log(`Question ${id} updated`);
  return getQuestionById(id, true);
};
