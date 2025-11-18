import debug from './log.js';
import { searchUsers } from '../../../service/users/searchUser.js';

const log = debug.extend('search');

export const searchUsersMethod = async (args = {}) => {
  log('Searching users');
  const { limit, offset, query } = args;

  const { users, total } = searchUsers({ limit, offset, query });
  const grouped = Object.values(
    users.reduce((acc, row) => {
      const { userId, name, email, phone, totalPoints, scoreType, scorePoints, scoreId } = row;

      if (!acc[userId]) {
        acc[userId] = {
          userId,
          name,
          email,
          phone,
          totalPoints,
          bonuses: [],
        };
      }

      // Only include bonuses if they exist
      if (scoreType && scoreId != null) {
        acc[userId].bonuses.push({
          scoreType,
          scorePoints,
          scoreId,
        });
      }

      return acc;
    }, {}),
  );

  return {
    users: grouped,
    limit,
    offset,
    total,
  };
};
