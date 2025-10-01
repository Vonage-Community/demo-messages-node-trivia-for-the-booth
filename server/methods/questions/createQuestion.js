import { createQuestion } from '../../../service/questions.js';
import debug from './log.js';

const log = debug.extend('create');

export const createQuestionMethod = async (args) => {
  log('Creating question');
  return createQuestion(args);
};

