import db from '../../db/index.js';
import { requireUInt, requireNonEmptyString } from '../helpersAndGuards.js';
import { checkCorrectChoice } from '../questions/createQuestion.js';
import { getQuestionById } from '../questions/getQuestionById.js';
import { getGameById } from '../games.js';
import debug from './log.js';

const log = debug.extend('submit-answer');

const getAnswerTimingStmt = db.prepare(`
  SELECT client_received_at
  FROM answers
  WHERE game_id = ? AND question_id = ? AND player_id = ?
    AND player_answer = 'N'
`);

const updateAnswerStmt = db.prepare(`
  UPDATE answers
     SET player_answer = @answer,
         client_answered_at = @clientAnsweredAt,
         server_received_at = strftime('%s','now'),
         response_time_ms = (@clientAnsweredAt - client_received_at) * 1000
   WHERE game_id = @gameId
     AND question_id = @questionId
     AND player_id = @playerId
     AND player_answer = 'N'
`);

export const checkForNextQuestionStmt = db.prepare(`
SELECT
  CASE
    WHEN EXISTS (
      SELECT 1
      FROM questions q
      WHERE q.game_id = @gameId
        AND q.id NOT IN (
          SELECT a.question_id
          FROM answers a
          WHERE a.game_id = @gameId
            AND a.player_id = @playerId
        )
    )
    THEN 1 ELSE 0
  END AS has_next_question;
`);

export const submitAnswerForPlayer = (args = {}) => {
  log('Submitting answer', args);

  const gameId = requireUInt('gameId', args.gameId);
  const questionId = requireUInt('questionId', args.questionId);
  const playerId = args._auth.id;
  const answer = checkCorrectChoice(
    requireNonEmptyString('answer', args.answer),
  );

  const game = getGameById(gameId);
  if (!game.active && !game.bonusGame) {
    throw {
      code: 400,
      message: 'Game is not active. Answers cannot be submitted.',
    };
  }

  const question = getQuestionById(questionId, true);
  if (!question) {
    throw {
      code: 404,
      message: 'Invalid Question. Answers cannot be submitted.',
    };
  }

  // Validate timestamp
  const clientAnsweredAt = Number(args.clientAnsweredAt);
  if (!clientAnsweredAt || Number.isNaN(clientAnsweredAt)) {
    throw {
      code: -32602,
      message: 'clientAnsweredAt must be provided as epoch seconds',
    };
  }

  // Check that the question has been presented to the player
  const record = getAnswerTimingStmt.get(gameId, questionId, playerId);
  if (!record) {
    throw {
      code: 400,
      message: 'No pending question found to update',
    };
  }

  // Anti cheat checks
  const now = Math.floor(Date.now() / 1000);

  // Answered at cannot be before the question was presented
  if (clientAnsweredAt < record.client_received_at) {
    throw {
      code: 400,
      message: 'Invalid answeredAt: before question received',
    };
  }

  // Check that the answeredAt is no more than 10 seconds in the future
  if (clientAnsweredAt > now + 10) {
    throw {
      code: 400,
      message: 'Invalid answeredAt: in the future',
    };
  }

  const info = updateAnswerStmt.run({
    gameId,
    questionId,
    playerId,
    answer,
    clientAnsweredAt,
  });

  if (info.changes === 0) {
    throw {
      code: 400,
      message: 'Question already answered or invalid state',
    };
  }

  log(`Player ${playerId} answered ${answer} for question ${questionId}`);

  const { has_next_question: hasNextQuestion } = checkForNextQuestionStmt.get({
    gameId,
    playerId,
  });

  log('Has next question', hasNextQuestion);

  return {
    gameId,
    questionId,
    answer,
    answeredCorrectly: answer === question.correctChoice,
    correctAnswer: question.correctChoice,
    hasNext: !!hasNextQuestion,
  };
};
