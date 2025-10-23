// eslint-disable-next-line n/no-unpublished-import
import request from 'supertest';
import jayson from 'jayson/promise';
import methods from '../server/methods/index.js';

export const server = new jayson.Server(methods);
export const httpServer = server.http();
export const agent = request(httpServer);

export const rpc = (method, params = {}, id = '1') => agent
  .post('/rpc')
  .set('content-type', 'application/json')
  .send({
    jsonrpc: '2.0',
    id: id,
    method: method,
    params: {
      ...params,
      _auth: {
        user: 'test user',
        role: 'admin',
      },
    },
  });
