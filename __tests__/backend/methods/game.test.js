import { rpc } from '../../server.js';
import { faker } from '@faker-js/faker';

describe('Game RPC calls', () => {
  let game;
  let otherGame;

  test.only('No game shows up in list', async () => {
    const rpcResult = await rpc(
      'games.list',
    );

    const { result, error } = rpcResult.body;

    expect(error).toBeUndefined();

    expect(result).toEqual({
      limit: 50,
      offset: 0,
      total: 0,
      games: [],
    });
  });

  test('Error returned when missing required params', async () => {
    const rpcResult = await rpc(
      'games.create',
    );

    const { error, result } = rpcResult.body;
    expect(result).toBeUndefined();
    expect(error).toEqual({
      code: -32602,
      message: 'title is required',
    });
  });

  test('Game can be created', async () => {
    const params = {
      title: faker.person.firstName(),
    };

    const rpcResult = await rpc(
      'games.create',
      params,
    );

    const { error, result } = rpcResult.body;

    expect(error).toBeUndefined();
    expect(result.id).toBeDefined();

    expect(result).toEqual({
      id: result.id,
      active: false,
      ...params,
    });
    game = result;
  });

  test('Game appears in list', async () => {
    const rpcResult = await rpc(
      'games.list',
    );

    const { error, result } = rpcResult.body;
    expect(error).toBeUndefined();
    expect(result).toEqual({
      limit: 50,
      offset: 0,
      total: 1,
      games: [game],
    });
  });

  test('Game not found', async () => {
    const params = {
      id: faker.number.int(),
    };

    const rpcResult = await rpc(
      'games.fetch',
      params,
    );

    const { error, result } = rpcResult.body;

    expect(result).toBeUndefined();

    expect(error).toEqual({
      code: -32004,
      message: 'Game not found',
    });
  });

  test('Game can be fetched by id', async () => {
    const params = {
      id: game.id,
    };

    const rpcResult = await rpc(
      'games.fetch',
      params,
    );

    const { error, result } = rpcResult.body;

    expect(error).toBeUndefined();

    expect(result).toEqual(game);
  });

  test('Another game can be created', async () => {
    const params = {
      title: faker.person.firstName(),
    };

    const rpcResult = await rpc(
      'games.create',
      params,
    );

    const { error, result } = rpcResult.body;
    expect(error).toBeUndefined();
    expect(result.id).toBeDefined();

    expect(result).toEqual({
      id: result.id,
      active: false,
      ...params,
    });
    otherGame = result;
  });

  test('Game appears in list on page one', async () => {
    const rpcResult = await rpc(
      'games.list',
      {
        limit: 1,
      },
    );

    const { error, result } = rpcResult.body;

    expect(error).toBeUndefined();
    expect(result).toEqual({
      limit: 1,
      offset: 0,
      total: 2,
      games: [game],
    });

  });

  test('Other game appears in list on page one', async () => {
    const rpcResult = await rpc(
      'games.list',
      {
        limit: 1,
        offset: 1,
      },
    );

    const { error, result } = rpcResult.body;
    expect(error).toBeUndefined();
    expect(result).toEqual({
      limit: 1,
      offset: 1,
      total: 2,
      games: [otherGame],
    });
  });

  test('Game can update', async () => {
    const params = {
      id: game.id,
      title: faker.person.firstName(),
      active: true,
    };

    const rpcResult = await rpc(
      'games.update',
      params,
    );

    const { result, error } = rpcResult.body;
    expect(error).toBeUndefined();
    expect(result).toEqual({
      ...params,
      active: false, // Check to make sure the method wont allow updating active flag
    });
    game = result;
  });

  test('No active game is returned', async () => {
    const rpcResult = await rpc(
      'games.active',
    );

    const { error, result } = rpcResult.body;
    expect(result).toBeUndefined();
    expect(error).toEqual({
      code: -32004,
      message: 'No active game found',
    });
  });

  test('Game can be activated', async () => {
    const rpcResult = await rpc(
      'games.activate',
      { id: game.id },
    );

    const { error, result } = rpcResult.body;
    expect(error).toBeUndefined();
    expect(result).toEqual({
      ...game,
      active: true,
    });

    const listGameRpcResult = await rpc(
      'games.list',
    );

    expect(listGameRpcResult.body.result).toEqual({
      limit: 50,
      offset: 0,
      total: 2,
      games: [
        {
          ...game,
          active: true,
        },
        otherGame,
      ],
    });
  });

  test('Game can be activated again', async () => {
    const rpcResult = await rpc(
      'games.activate',
      { id: game.id },
    );

    const { error, result } = rpcResult.body;
    expect(error).toBeUndefined();
    expect(result).toEqual({
      ...game,
      active: true,
    });

    const listGameRpcResult = await rpc(
      'games.list',
    );

    expect(listGameRpcResult.body.result).toEqual({
      limit: 50,
      offset: 0,
      total: 2,
      games: [
        {
          ...game,
          active: true,
        },
        otherGame,
      ],
    });
  });

  test('Active game is returned', async () => {
    const rpcResult = await rpc(
      'games.active',
    );

    const { error, result } = rpcResult.body;
    expect(error).toBeUndefined();
    expect(result).toEqual({
      ...game,
      active: true,
    });
  });

  test('Game can be activated and deactivates other game', async () => {
    const rpcResult = await rpc(
      'games.activate',
      { id: otherGame.id },
    );

    const { error, result } = rpcResult.body;
    expect(error).toBeUndefined();
    expect(result).toEqual({
      ...otherGame,
      active: true,
    });

    const listGameRpcResult = await rpc(
      'games.list',
    );

    expect(listGameRpcResult.body.result).toEqual({
      limit: 50,
      offset: 0,
      total: 2,
      games: [
        game,
        {
          ...otherGame,
          active: true,
        },
      ],
    });
  });

  test('Deactivate game', async () => {
    const rpcResult = await rpc(
      'games.deactivate',
      { id: otherGame.id },
    );

    const { error, result } = rpcResult.body;
    expect(error).toBeUndefined();
    expect(result).toEqual(otherGame);

    const listGameRpcResult = await rpc(
      'games.list',
    );

    expect(listGameRpcResult.body.result).toEqual({
      limit: 50,
      offset: 0,
      total: 2,
      games: [
        game,
        otherGame,
      ],
    });
  });

  test('Deactivate game again', async () => {
    const rpcResult = await rpc(
      'games.deactivate',
      { id: otherGame.id },
    );

    const { error, result } = rpcResult.body;
    expect(result).toBeUndefined();
    expect(error).toEqual({
      code: -32004,
      message: 'No active game found',
    });
  });

  test('Can delete game', async () => {
    const params = {
      id: game.id,
    };

    const rpcResult = await rpc(
      'games.delete',
      params,
    );

    const { result, error } = rpcResult.body;
    expect(error).toBeUndefined();
    expect(result).toEqual(game);
  });

  test('Game no longer appears in list', async () => {
    const rpcResult = await rpc(
      'games.list',
    );

    const { error, result } = rpcResult.body;
    expect(error).toBeUndefined();
    expect(result).toEqual({
      limit: 50,
      offset: 0,
      total: 1,
      games: [otherGame],
    });
  });


});
