import { deleteUser } from '../../../service/users.js';

export const deleteUserMethod = async ({ id }) => {
  console.debug('Deleting user', id);

  return {
    user: deleteUser(id),
  };
};
