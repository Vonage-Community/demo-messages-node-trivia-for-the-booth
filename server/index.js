import jayson from 'jayson/promise/index.js';
import methods from './methods/index.js';
import log from './log.js';

const server = new jayson.Server(methods);

server.http().listen(3000, () => {
  log('Listening at http://localhost:3000/rpc');
});
