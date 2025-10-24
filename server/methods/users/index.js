import { requireLogin } from '../../auth.js';
import { fetchUserMethod } from './fetchUser.js';
import { registerUserMethod } from './registerUser.js';
import { listUsersMethod } from './listUsers.js';
import { deleteUserMethod } from './deleteUser.js';
import { updateUserMethod } from './updateUser.js';
import { searchUsersMethod } from './searchUser.js';

export const users = {
  fetch: requireLogin(fetchUserMethod, 'admin'),
  register: registerUserMethod,
  list: requireLogin(listUsersMethod, 'admin'),
  delete: requireLogin(deleteUserMethod, 'admin'),
  update: requireLogin(updateUserMethod, 'admin'),
  search: requireLogin(searchUsersMethod, 'admin'),
};
