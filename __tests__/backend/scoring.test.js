import { faker } from '@faker-js/faker';
import db from '../../db/index.js';
import { ensureSchema } from '../../db/schemas/index.js';
import { addPlayerToGame } from '../../service/players/addPlayerToGame.js';
import { submitAnswerForPlayer } from '../../service/players/submitAnswerForPlayer.js';
import { createGame } from '../../service/games/createGame.js';
import { createUser } from '../../service/users/createUser.js';
import { createQuestionsBatch } from '../../service/questions/createQuestion.js';
import { getAllQuestions } from '../../service/questions/getAllQuestions.js';
import { recordPresentedStmt } from '../../service/players/getNextQuestionForPlayer.js';
import { setActiveGame } from '../../service/games/setActiveGame.js';

const dropAllTables = () => {
  db.exec('PRAGMA foreign_keys = OFF;');
  const tables = db.prepare(`
    SELECT name FROM sqlite_master
    WHERE type='table' AND name NOT LIKE 'sqlite_%';
  `).all();

  for (const { name } of tables) {
    db.exec(`DROP TABLE IF EXISTS "${name}";`);
  }

  db.exec('PRAGMA foreign_keys = ON;');
};


describe('Scores', () => {
  let user;
  let game;
  let questions = [];

  beforeEach(() => {

    ensureSchema();
    user = createUser({
      name: faker.person.firstName(),
      email: faker.internet.email(),
      phone: faker.phone.number(),
      password: faker.internet.password(),
    });

    game = createGame({
      title: faker.person.firstName(),
    });


    setActiveGame(game.id);
    addPlayerToGame({
      gameId: game.id,
      _auth: {
        id: user.id,
      },
    });

    createQuestionsBatch(
      game.id,
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((number) => ({
        gameId: game.id,
        question: `Which country is ${faker.location.city()} located?`,
        choiceA: faker.location.country(),
        choiceB: faker.location.country(),
        choiceC: faker.location.country(),
        choiceD: faker.location.country(),
        correctChoice: 'B',
      })),
    );

    questions = getAllQuestions();
  });

  afterEach(() => {
    questions = [];
    dropAllTables();
  });

  const recordPresented = (question, timeToAnswer, answer = 'B') => {
    const serverTime = Math.floor(Date.now() / 1000) - 10000;

    recordPresentedStmt.run({
      gameId: game.id,
      questionId: question.id,
      playerId: user.id,
      clientReceivedAt: serverTime,
    });

    const result = submitAnswerForPlayer({
      questionId: question.id,
      gameId: game.id,
      answer: answer,
      clientAnsweredAt: (serverTime + timeToAnswer),
      _auth: {
        id: user.id,
      },
    });

    return result;
  };


  test('Gets one point for correct answer', () => {
    const result = recordPresented(questions[0], 9000);

    expect(result).toEqual({
      answer: 'B',
      answeredCorrectly: true,
      correctAnswer: 'B',
      gameId: game.id,
      questionId: questions[0].id,
      hasNext: true,
      score: 1,
      bonuses: [
        {
          type: 'Correct Answer',
          points: 1,
        },
      ],
      totalScore: 1,
    });
  });

  test('Gets bonus points for Quick answer', () => {
    const result = recordPresented(questions[0], 8000);

    expect(result).toEqual({
      answer: 'B',
      answeredCorrectly: true,
      correctAnswer: 'B',
      gameId: game.id,
      questionId: questions[0].id,
      hasNext: true,
      score: 2,
      bonuses: [
        {
          type: 'Correct Answer',
          points: 1,
        },
        {
          type: 'Quick',
          points: 1,
        },
      ],
      totalScore: 2,
    });
  });

  test('Gets bonus points for Fast answer', () => {
    const result = recordPresented(questions[0], 5000);

    expect(result).toEqual({
      answer: 'B',
      answeredCorrectly: true,
      correctAnswer: 'B',
      gameId: game.id,
      questionId: questions[0].id,
      hasNext: true,
      score: 3,
      bonuses: [
        {
          type: 'Correct Answer',
          points: 1,
        },
        {
          type: 'Fast',
          points: 2,
        },
      ],
      totalScore: 3,
    });
  });

  test('Gets bonus points for Lightning fast answer', () => {
    const result = recordPresented(questions[0], 2000);

    expect(result).toEqual({
      answer: 'B',
      answeredCorrectly: true,
      correctAnswer: 'B',
      gameId: game.id,
      questionId: questions[0].id,
      hasNext: true,
      score: 4,
      bonuses: [
        {
          type: 'Correct Answer',
          points: 1,
        },
        {
          type: 'Lightning Fast',
          points: 3,
        },
      ],
      totalScore: 4,
    });
  });

  test('Gets bonus points for 3 question streak', () => {
    recordPresented(questions[0], 9000);
    recordPresented(questions[1], 9000);
    const result = recordPresented(questions[2], 9000);

    expect(result).toEqual({
      answer: 'B',
      answeredCorrectly: true,
      correctAnswer: 'B',
      gameId: game.id,
      questionId: questions[2].id,
      hasNext: true,
      score: 2,
      bonuses: [
        {
          type: 'Correct Answer',
          points: 1,
        },
        {
          type: 'On a Roll',
          points: 1,
        },
      ],
      totalScore: 4,
    });
  });

  test('Gets bonus points for 5 question streak', () => {
    recordPresented(questions[0], 9000);
    recordPresented(questions[1], 9000);
    recordPresented(questions[2], 9000);
    recordPresented(questions[3], 9000);
    const result = recordPresented(questions[4], 9000);

    expect(result).toEqual({
      answer: 'B',
      answeredCorrectly: true,
      correctAnswer: 'B',
      gameId: game.id,
      questionId: questions[4].id,
      hasNext: true,
      score: 3,
      bonuses: [
        {
          type: 'Correct Answer',
          points: 1,
        },
        {
          type: 'Hot Streak',
          points: 2,
        },
      ],
      totalScore: 9,
    });
  });

  test('Gets bonus points for 8 question streak', () => {
    recordPresented(questions[0], 9000);
    recordPresented(questions[1], 9000);
    recordPresented(questions[2], 9000);
    recordPresented(questions[3], 9000);
    recordPresented(questions[4], 9000);
    recordPresented(questions[5], 9000);
    recordPresented(questions[6], 9000);
    const result = recordPresented(questions[7], 9000);

    expect(result).toEqual({
      answer: 'B',
      answeredCorrectly: true,
      correctAnswer: 'B',
      gameId: game.id,
      questionId: questions[7].id,
      hasNext: true,
      score: 4,
      bonuses: [
        {
          type: 'Correct Answer',
          points: 1,
        },
        {
          type: 'Unstoppable',
          points: 3,
        },
      ],
      totalScore: 19,
    });
  });

  test('Gets bonus points for 10 question streak', () => {
    recordPresented(questions[0], 9000);
    recordPresented(questions[1], 9000);
    recordPresented(questions[2], 9000);
    recordPresented(questions[3], 9000);
    recordPresented(questions[4], 9000);
    recordPresented(questions[5], 9000);
    recordPresented(questions[6], 9000);
    recordPresented(questions[7], 9000);
    recordPresented(questions[8], 9000);
    const result = recordPresented(questions[9], 9000);

    expect(result).toEqual({
      answer: 'B',
      answeredCorrectly: true,
      correctAnswer: 'B',
      gameId: game.id,
      questionId: questions[9].id,
      hasNext: false,
      score: 6,
      bonuses: [
        {
          type: 'Correct Answer',
          points: 1,
        },
        {
          type: 'Flawless Run',
          points: 5,
        },
      ],
      totalScore: 29,
    });
  });

  test('Gets bonus points perfect game', () => {
    recordPresented(questions[0], 2000);
    recordPresented(questions[1], 2000);
    recordPresented(questions[2], 2000);
    recordPresented(questions[3], 2000);
    recordPresented(questions[4], 2000);
    recordPresented(questions[5], 2000);
    recordPresented(questions[6], 2000);
    recordPresented(questions[7], 2000);
    recordPresented(questions[8], 2000);
    const result = recordPresented(questions[9], 2000);

    expect(result).toEqual({
      answer: 'B',
      answeredCorrectly: true,
      correctAnswer: 'B',
      gameId: game.id,
      questionId: questions[9].id,
      hasNext: false,
      score: 9,
      bonuses: [
        {
          type: 'Correct Answer',
          points: 1,
        },
        {
          type: 'Lightning Fast',
          points: 3,
        },
        {
          type: 'Flawless Run',
          points: 5,
        },
      ],
      totalScore: 59,
    });
  });

  test('Broken streak resets', () => {
    recordPresented(questions[0], 9000);
    recordPresented(questions[1], 9000);
    recordPresented(questions[2], 9000);
    recordPresented(questions[3], 9000, 'C');
    recordPresented(questions[4], 9000);
    recordPresented(questions[5], 9000);
    const result = recordPresented(questions[6], 9000);

    expect(result).toEqual({
      answer: 'B',
      answeredCorrectly: true,
      correctAnswer: 'B',
      gameId: game.id,
      questionId: questions[6].id,
      hasNext: true,
      score: 2,
      bonuses: [
        {
          type: 'Correct Answer',
          points: 1,
        },
        {
          type: 'On a Roll',
          points: 1,
        },
      ],
      totalScore: 8,
    });
  });

  test('Broken streak and incorect answer', () => {
    recordPresented(questions[0], 9000);
    recordPresented(questions[1], 9000);
    recordPresented(questions[2], 9000);
    const result = recordPresented(questions[3], 9000, 'C');

    expect(result).toEqual({
      answer: 'C',
      answeredCorrectly: false,
      correctAnswer: 'B',
      gameId: game.id,
      questionId: questions[3].id,
      hasNext: true,
      score: 0,
      bonuses: [],
      totalScore: 4,
    });
  });
});
