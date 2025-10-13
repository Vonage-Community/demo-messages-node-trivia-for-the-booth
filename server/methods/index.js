import * as userMethods from './users/index.js';
import * as gameMethods from './games/index.js';
import * as questionMethods from './questions/index.js';
import { loginMethod } from './login.js';
import log from './log.js';
import { catchError } from './catchError.js';

const methods = {
  ...userMethods,
  ...gameMethods,
  ...questionMethods,
  login: loginMethod,
};

const collapse = (stem, sep, obj) => (map, key) => {
  const prop = stem ? stem + sep + key : key;
  const value = obj[key];

  if (typeof value === 'function') {
    map[prop] = catchError(value);
    return map;
  }

  if (typeof value === 'object' && value !== null) {
    return Object.keys(value).reduce(collapse(prop, sep, value), map);
  }

  return map;
};

const mappedMethods = Object.keys(methods).reduce(collapse('', '.', methods), {});

log('Available methods', Object.keys(mappedMethods));

export default mappedMethods;
