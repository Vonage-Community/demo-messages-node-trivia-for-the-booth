import { faker } from '@faker-js/faker';
import db from '../../db/index.js';
import { ensureSchema } from '../../db/schemas/index.js';
import { addPlayerToGame } from '../../service/players/addPlayerToGame.js';
import { getNextQuestionForPlayer } from '../../service/players/getNextQuestionForPlayer.js';
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

let user;
let game;
let questions = [];

const reset = (bonusGame = false) => {
  ensureSchema();
  user = createUser({
    name: faker.person.firstName(),
    email: faker.internet.email(),
    phone: faker.phone.number(),
    password: faker.internet.password(),
  });

  game = createGame({
    title: faker.person.firstName(),
    bonusGame: bonusGame,
  });

  if (!bonusGame) {
    setActiveGame(game.id);
  }

  addPlayerToGame({
    gameId: game.id,
    _auth: {
      id: user.id,
    },
  });

  createQuestionsBatch(
    game.id,
    [1, 2, 3, 4, 5].map((number) => ({
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
};

const recordPresented = (question, timeToAnswer, answer) => {
  const serverTime = Math.floor(Date.now() / 1000) - 10000;

  recordPresentedStmt.run({
    gameId: game.id,
    questionId: question.id,
    playerId: user.id,
    clientReceivedAt: serverTime,
  });

  if (answer) {
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
  }
};
describe('Next Question', () => {
  beforeEach(reset);

  afterEach(() => {
    questions = [];
    dropAllTables();
  });


  test('Gets next question at game start', () => {
    const nextQuestion = getNextQuestionForPlayer({
      playerId: user.id,
      gameId: game.id,
    });

    expect(nextQuestion).toEqual(questions[0]);
  });

  test('Gets same question at game start', () => {
    getNextQuestionForPlayer({
      playerId: user.id,
      gameId: game.id,
    });

    const nextQuestion = getNextQuestionForPlayer({
      playerId: user.id,
      gameId: game.id,
    });

    expect(nextQuestion).toEqual(questions[0]);
  });

  test('Gets next question after answer', () => {
    recordPresented(questions[0], 9000, 'B');

    const nextQuestion = getNextQuestionForPlayer({
      playerId: user.id,
      gameId: game.id,
    });

    expect(nextQuestion).toEqual(questions[1]);

    expect(getNextQuestionForPlayer({
      playerId: user.id,
      gameId: game.id,
    })).toEqual(questions[1]);
  });

  test('Gets next question after 3rd answer', () => {
    recordPresented(questions[0], 9000, 'B');
    recordPresented(questions[1], 9000, 'B');
    recordPresented(questions[2], 9000, 'B');

    const nextQuestion = getNextQuestionForPlayer({
      playerId: user.id,
      gameId: game.id,
    });

    expect(nextQuestion).toEqual(questions[3]);

    expect(getNextQuestionForPlayer({
      playerId: user.id,
      gameId: game.id,
    })).toEqual(questions[3]);
  });

  test('No next question at the end', () => {
    recordPresented(questions[0], 9000, 'B');
    recordPresented(questions[1], 9000, 'B');
    recordPresented(questions[2], 9000, 'B');
    recordPresented(questions[3], 9000, 'B');
    recordPresented(questions[4], 9000, 'B');

    const nextQuestion = getNextQuestionForPlayer({
      playerId: user.id,
      gameId: game.id,
    });

    expect(nextQuestion).toBeNull();

    expect(getNextQuestionForPlayer({
      playerId: user.id,
      gameId: game.id,
    })).toBeNull();
  });
});

describe('Next question for Bonus game', () => {
  afterEach(() => {
    questions = [];
    dropAllTables();
  });

  test('No next question for bonus game', () => {
    reset(true);
    expect(getNextQuestionForPlayer({
      playerId: user.id,
      gameId: game.id,
    })).toBeNull();

    expect(game.bonusGame).toBeTruthy();

    recordPresented(questions[0], 9000);
    const serverTime = Math.floor(Date.now() / 1000) - 10000;
    const result = submitAnswerForPlayer({
      questionId: questions[0].id,
      gameId: game.id,
      answer: 'B',
      clientAnsweredAt: (serverTime + 9000),
      _auth: {
        id: user.id,
      },
    });

    expect(getNextQuestionForPlayer({
      playerId: user.id,
      gameId: game.id,
    })).toBeNull();

    expect(result).toEqual({
      answer: 'B',
      answeredCorrectly: true,
      correctAnswer: 'B',
      gameId: game.id,
      questionId: questions[0].id,
      hasNext: false,
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
});
