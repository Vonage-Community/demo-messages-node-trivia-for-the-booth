import { getUserById, getUserByEmail } from '../../../service/users.js';

export const fetchUserMethod = async ({ id, email }) => {
  if (id) {
    return getUserById(id);
  }

  if (!email) {
    return getUserByEmail(email);
  }

  throw {
    code: -32602,
    message: 'email or id is required',
  };
};
