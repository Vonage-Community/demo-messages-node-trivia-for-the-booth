import jayson from 'jayson/promise/index.js';
import methods from './methods/index.js';
import debug from './log.js';

const log = debug.extend('rpc');

const server = new jayson.Server(methods);

const port = process.env.PORT || 3000;

server.http().listen(port, () => {
  log('Listening at http://localhost:3000/rpc');
});
