import { getQuestionsForGame } from '../questions/getQuestionsForGame.js';
import { getAnswersForPlayer } from './getAnswersForPlayer.js';
import fs from 'node:fs';
import path from 'node:path';
import debug from './log.js';
import db from '../../db/index.js';
const log = debug.extend('scoring');

const configFilePath = path.join(process.cwd(), 'data', 'bonuses.json');
const configFileContents = fs.readFileSync(configFilePath, 'utf-8');
const { scoring } = JSON.parse(configFileContents);

scoring.streakBonus = scoring.streakBonus.sort((streakA, streakB) => {
  if (streakA.streak === streakB.streak) {
    return 0;
  }
  return streakA.streak > streakB.streak ? -1 : 1;
});

const insertBonus = db.prepare(`
  INSERT INTO scores (game_id, answer_id, user_id, score_type, score_points)
  VALUES (@gameId, @answerId, @userId, @scoreType, @scorePoints)
`);

const insertMany = db.transaction((bonusesArray) => {
  for (const bonus of bonusesArray) {
    insertBonus.run(bonus);
  }
});

const getSpeedBonus = (responseTimeMs) => {
  log('Response time', responseTimeMs);

  if (typeof responseTimeMs !== 'number' || responseTimeMs < 0) {
    return 0;
  }

  const matchingTier = scoring.speedBonus.find((bonusTier) => {
    return bonusTier.maxMs === null || responseTimeMs <= bonusTier.maxMs;
  });

  if (!matchingTier) {
    return false;
  }

  return matchingTier;
};

const findQuestion = (questions, questionId) => questions.find(
  ({ id }) => id === questionId);

const getStreakBonus = (questions, playerId, gameId) => {
  const playerAnswers = getAnswersForPlayer({ playerId, gameId });
  log('playerAnswers', playerAnswers);
  let broken = false;
  const streakCount = playerAnswers.reverse().reduce(
    (streak, answer) => {
      if (answer.playerAnswer === 'N') {
        return streak;
      }

      if (broken) {
        return streak;
      }

      const isCorrect = findQuestion(
        questions,
        answer.questionId,
      )?.correctChoice === answer.playerAnswer;

      if (!isCorrect) {
        log('Broken streak');
        broken = true;
        return streak;
      }


      streak++;
      return streak;
    },
    0,
  );

  log('Scores', scoring.streakBonus);
  return scoring.streakBonus.find((streakBonus) => {
    const { streak } = streakBonus;
    return streakCount >= streak;
  });
};

export const scoreAnswer = (params = {}) => {
  const {
    gameId,
    questionId,
    answer,
    userId,
    clientAnsweredAt,
    answerId,
    clientRecievedAt,
  } = params;

  const buildBonus = (type, points) => ({
    gameId: gameId,
    answerId: answerId,
    userId: userId,
    scoreType: type,
    scorePoints: points,
  });

  const bonuses = [];

  const questions = getQuestionsForGame(gameId, true);
  const currentQuestion = questions.find(({ id }) => id === questionId);
  log('Current Question', currentQuestion);

  const answeredCorrectly = answer === currentQuestion.correctChoice;
  if (answeredCorrectly) {
    log('Answered Correct?', answeredCorrectly);
    bonuses.push(buildBonus('Correct Answer', 1));
  }

  const speedBonus = getSpeedBonus(clientAnsweredAt - clientRecievedAt);
  log('Speed Bonus', speedBonus);
  if (speedBonus) {
    bonuses.push(buildBonus(speedBonus.label, speedBonus.points));
  }

  const streakBonus = getStreakBonus(questions, userId, gameId);
  log('Streak Bonus', streakBonus);
  if (streakBonus) {
    bonuses.push(buildBonus(streakBonus.label, streakBonus.points));
  }

  log('bonuses', bonuses);
  insertMany(bonuses);

  return [
    bonuses.reduce((score, { scorePoints }) => score += scorePoints, 0),
    bonuses.map(({ scoreType, scorePoints }) => ({
      type: scoreType,
      points: scorePoints,
    })),
  ];
};




