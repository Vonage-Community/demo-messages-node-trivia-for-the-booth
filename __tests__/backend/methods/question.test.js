import { rpc } from '../../server.js';
import { faker } from '@faker-js/faker';
import { createGame, deleteGame } from '../../../service/games.js';

describe('Question RPC calls', () => {
  let question;
  const game = createGame({
    title: faker.person.firstName(),
  });

  afterAll(() => {
    deleteGame(game.id);
  });

  test('No question shows up in list', async () => {
    const rpcResult = await rpc(
      'questions.for_game',
      {
        gameId: game.id,
      },
    );

    const { result, error } = rpcResult.body;

    expect(error).toBeUndefined();

    expect(result).toEqual([]);
  });

  test('Error returned when missing required params', async () => {
    const rpcResult = await rpc(
      'questions.create',
    );

    const { error, result } = rpcResult.body;
    expect(result).toBeUndefined();
    expect(error).toEqual({
      code: -32004,
      message: 'Game not found',
    });
  });

  test('Question can be created', async () => {
    const params = {
      gameId: game.id,
      question: `Which country is ${faker.location.city()} located?`,
      choiceA: faker.location.country(),
      choiceB: faker.location.country(),
      choiceC: faker.location.country(),
      choiceD: faker.location.country(),
      correctChoice: faker.string.fromCharacters(['A', 'B', 'C', 'D']),
    };

    const rpcResult = await rpc(
      'questions.create',
      params,
    );

    const { error, result } = rpcResult.body;

    expect(error).toBeUndefined();
    expect(result.id).toBeDefined();

    expect(result).toEqual({
      id: result.id,
      ...params,
    });
    question = result;
  });

  test('Question appears in list', async () => {
    const rpcResult = await rpc(
      'questions.for_game',
      { gameId: game.id },
    );

    const { error, result } = rpcResult.body;

    expect(error).toBeUndefined();
    expect(result).toEqual([question]);
  });

  test('Question not found', async () => {
    const params = {
      id: faker.number.int(),
    };

    const rpcResult = await rpc(
      'questions.fetch',
      params,
    );

    const { error, result } = rpcResult.body;

    expect(result).toBeUndefined();

    expect(error).toEqual({
      code: -32004,
      message: 'Question not found',
    });
  });

  test('Question can be fetched by id', async () => {
    const params = {
      id: question.id,
    };

    const rpcResult = await rpc(
      'questions.fetch',
      params,
    );

    const { error, result } = rpcResult.body;

    expect(error).toBeUndefined();

    expect(result).toEqual(question);
  });

  test('Fetching question fails when missing ID', async () => {
    const rpcResult = await rpc(
      'questions.fetch',
    );

    const { error, result } = rpcResult.body;

    expect(result).toBeUndefined();

    expect(error).toEqual({
      code: -32004,
      message: 'Question not found',
    });
  });

  test('Question can update', async () => {
    const params = {
      id: question.id,
      gameId: game.id,
      question: `Which country is ${faker.location.city()} located?`,
      choiceA: faker.location.country(),
      choiceB: faker.location.country(),
      choiceC: faker.location.country(),
      choiceD: faker.location.country(),
      correctChoice: faker.string.fromCharacters(['A', 'B', 'C', 'D']),
    };

    const rpcResult = await rpc(
      'questions.update',
      params,
    );

    const { result, error } = rpcResult.body;
    expect(error).toBeUndefined();
    expect(result).toEqual(params);
    question = result;
  });

  test('Can delete question', async () => {
    const params = {
      id: question.id,
    };

    const rpcResult = await rpc(
      'questions.delete',
      params,
    );

    const { result, error } = rpcResult.body;
    expect(error).toBeUndefined();
    expect(result).toEqual(question);
  });

  test('Question no longer appears in list on page one', async () => {
    const rpcResult = await rpc(
      'questions.for_game',
      { gameId: game.id },
    );

    const { error, result } = rpcResult.body;
    expect(error).toBeUndefined();
    expect(result).toEqual([]);
  });
});
