import { deleteUser } from '../../../service/users.js';
import debug from './log.js';

const log = debug.extend('delete');

export const deleteUserMethod = async ({ id }) => {
  log('Deleting user', id);

  return deleteUser(id);
};
