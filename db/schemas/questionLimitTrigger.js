import db from '../index.js';
import debug from './log.js';

const log = debug.extend('questions:trigger');

export const createQuestionsLimitTrigger = () => {
  log('Creating question limit trigger');
  db.exec(`
    CREATE TRIGGER IF NOT EXISTS limit_questions_per_game
    BEFORE INSERT ON questions
    WHEN (
      (SELECT COUNT(*) FROM questions WHERE game_id = NEW.game_id) >= 20
    )
    BEGIN
      SELECT RAISE(FAIL, 'Cannot have more than 20 questions per game');
    END;
  `);

  log('Created question limit trigger');
};
