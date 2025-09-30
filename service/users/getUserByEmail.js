import db from '../../db/index.js';

export const selectUserByEmail = db.prepare(`
  SELECT id, name, email, phone
  FROM users
  WHERE email = ?
`);

export const getUserByEmail = (email) => {
  console.info('Get user by Email');
  if (!email) {
    throw {
      code: -32602,
      message: 'email is required',
    };
  }

  const user = selectUserByEmail.get(email) || null;

  if (!user) {
    console.debug('No user with that email');
    throw {
      code: -32004,
      message: 'User not found',
    };
  }

  return user;
};
