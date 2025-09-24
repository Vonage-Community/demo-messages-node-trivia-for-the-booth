import { removeUser } from '../../../service/users.js';

export const deleteUserMethod = async ({ id }) => {
  console.debug('Deleting user', id);

  return {
    user: removeUser(id),
  };
};
