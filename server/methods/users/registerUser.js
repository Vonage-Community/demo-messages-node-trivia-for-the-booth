import { createUser } from '../../../service/users.js';

export const registerUserMethod = async (args = {}) => {
  console.debug('Method: Register User', args);

  const user = createUser(args);
  return user;
};
