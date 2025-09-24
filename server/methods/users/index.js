import { fetchUserMethod } from './fetchUser.js';
import { registerUserMethod } from './registerUser.js';
import { listUsersMethod } from './listUsers.js';
import { deleteUserMethod } from './deleteUser.js';
import { updateUserMethod } from './updateUser.js';

export const users = {
  fetch: fetchUserMethod,
  register: registerUserMethod,
  list: listUsersMethod,
  delete: deleteUserMethod,
  update: updateUserMethod,
};
