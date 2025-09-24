import jayson from 'jayson/promise/index.js';
import * as methods from './methods/index.js';

const server = new jayson.Server(methods);

server.http().listen(3000, () => {
  console.log(`JSON-RPC listening at http://localhost:3000/rpc ${Date.now()}`);
});
