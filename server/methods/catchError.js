import debug from '../log.js';

const log = debug.extend('guard');

export const catchError = (method) => async (args) => {
  log(`Calling method ${method.name}`);
  try {
    const result = await method(args);
    log(`Method ${method.name} completed`, result);
    return result;
  } catch (error) {
    log(`Method ${method.name} errored`, error);
    throw error;
  }
};

