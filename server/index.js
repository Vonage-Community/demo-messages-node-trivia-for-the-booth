import jayson from 'jayson/promise/index.js';
import * as methods from './methods/index.js';

const collapse = (stem, sep, obj) => (map, key) => {
  const prop = stem ? stem + sep + key : key;
  const value = obj[key];

  if (typeof value === 'function') {
    map[prop] = value;
    return map;
  }

  if (typeof value === 'object' && value !== null) {
    return Object.keys(value).reduce(collapse(prop, sep, value), map);
  }

  return map;
};

const map = Object.keys(methods).reduce(collapse('', '.', methods), {});
console.log('Avialable methods', Object.keys(map));
const server = new jayson.Server(map);

server.http().listen(3000, () => {
  console.log(`JSON-RPC listening at http://localhost:3000/rpc ${Date.now()}`);
});
