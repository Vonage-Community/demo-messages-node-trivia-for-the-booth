import { updateUser } from '../../../service/users/updateUser.js';
import debug from './log.js';

const log = debug.extend('update');

export const updateUserMethod = async ({ id, ...args }) => {
  log('Updating user');
  return updateUser(id, args);
};
