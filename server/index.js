import jayson from 'jayson/promise/index.js';
import methods from './methods/index.js';
import debug from 'debug';

const log = debug('rpc');
const server = new jayson.Server(methods);

server.http().listen(3000, () => {
  log('Listening at http://localhost:3000/rpc');
});
