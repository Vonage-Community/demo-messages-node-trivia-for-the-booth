import { rpc } from '../../server.js';
import { faker } from '@faker-js/faker';

describe('User RPC calls', () => {
  let user;
  let otherUser;

  test('No user shows up in list', async () => {
    const rpcResult = await rpc(
      'users.list',
    );

    const { result, error } = rpcResult.body;

    expect(error).toBeUndefined();

    expect(result).toEqual({
      limit: 50,
      offset: 0,
      total: 0,
      users: [],
    });
  });

  test('Error returned when missing required params', async () => {
    const rpcResult = await rpc(
      'users.register',
    );

    const { error, result } = rpcResult.body;
    expect(result).toBeUndefined();
    expect(error).toEqual({
      code: -32602,
      message: 'name is required',
    });
  });

  test('User can be created', async () => {
    const params = {
      name: faker.person.firstName(),
      email: faker.internet.email(),
      phone: faker.phone.number(),
      password: faker.internet.password(),
    };

    const rpcResult = await rpc(
      'users.register',
      params,
    );

    const { error, result } = rpcResult.body;

    expect(error).toBeUndefined();
    expect(result.id).toBeDefined();
    const { password, ...paramsWithoutPassword } = params;

    expect(result).toEqual({
      id: result.id,
      ...paramsWithoutPassword,
    });
    user = result;
  });

  test('User appears in list', async () => {
    const listResult = await rpc(
      'users.list',
    );

    expect(listResult.body.result).toEqual({
      limit: 50,
      offset: 0,
      total: 1,
      users: [user],
    });
  });

  test('User not found', async () => {
    const params = {
      id: faker.number.int(),
    };

    const rpcResult = await rpc(
      'users.fetch',
      params,
    );

    const { error, result } = rpcResult.body;

    expect(result).toBeUndefined();

    expect(error).toEqual({
      code: -32004,
      message: 'User not found',
    });
  });

  test('User can be fetched by id', async () => {
    const params = {
      id: user.id,
    };

    const rpcResult = await rpc(
      'users.fetch',
      params,
    );

    const { error, result } = rpcResult.body;

    expect(error).toBeUndefined();

    expect(result).toEqual(user);
  });

  test('User can be fetched by email', async () => {
    const params = {
      email: user.email,
    };

    const rpcResult = await rpc(
      'users.fetch',
      params,
    );

    const { error, result } = rpcResult.body;

    expect(error).toBeUndefined();

    expect(result).toEqual(user);
  });

  test('Fetching user fails when missing ID or email', async () => {
    const rpcResult = await rpc(
      'users.fetch',
    );

    const { error, result } = rpcResult.body;

    expect(result).toBeUndefined();

    expect(error).toEqual({
      code: -32602,
      message: 'email or id is required',
    });
  });

  test('Another user cant be created with existing email', async () => {
    const params = {
      ...user,
    };

    const rpcResult = await rpc(
      'users.register',
      params,
    );

    const { error, result } = rpcResult.body;
    expect(result).toBeUndefined();

    expect(error).toEqual({
      code: -32010,
      message: 'Email already registered',
    });

    otherUser = result;
  });

  test('Another user can be created', async () => {
    const params = {
      name: faker.person.firstName(),
      email: faker.internet.email(),
      phone: faker.phone.number(),
      password: faker.internet.password(),
    };

    const rpcResult = await rpc(
      'users.register',
      params,
    );

    const { error, result } = rpcResult.body;
    expect(error).toBeUndefined();
    expect(result.id).toBeDefined();
    const { password, ...paramsWithoutPassword } = params;

    expect(result).toEqual({
      id: result.id,
      ...paramsWithoutPassword,
    });
    otherUser = result;
  });

  test('User appears in list on page one', async () => {
    const rpcResult = await rpc(
      'users.list',
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
      users: [user],
    });

  });

  test('Other user appears in list on page one', async () => {
    const rpcResult = await rpc(
      'users.list',
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
      users: [otherUser],
    });
  });

  test('User cannot update email address from other user', async () => {
    const rpcResult = await rpc(
      'users.update',
      {
        id: user.id,
        email: otherUser.email,
      },
    );

    const { result, error } = rpcResult.body;

    expect(result).toBeUndefined();

    expect(error).toEqual({
      code: -32010,
      message: 'Cannot update your email. Another user with that email is registered',
    });
  });

  test('User can update', async () => {
    const params = {
      id: user.id,
      name: faker.person.firstName(),
      email: faker.internet.email(),
      phone: faker.phone.number(),
    };

    const rpcResult = await rpc(
      'users.update',
      params,
    );

    const { result, error } = rpcResult.body;
    expect(error).toBeUndefined();
    expect(result).toEqual(params);
    user = result;
  });


  test('Can delete user', async () => {
    const params = {
      id: user.id,
    };

    const rpcResult = await rpc(
      'users.delete',
      params,
    );

    const { result, error } = rpcResult.body;
    expect(error).toBeUndefined();
    expect(result).toEqual(user);
  });

  test('User no longer appears in list on page one', async () => {
    const rpcResult = await rpc(
      'users.list',
    );

    const { error, result } = rpcResult.body;
    expect(error).toBeUndefined();
    expect(result).toEqual({
      limit: 50,
      offset: 0,
      total: 1,
      users: [otherUser],
    });
  });
});
