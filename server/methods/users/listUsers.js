import { listUsers as list } from '../../../service/users.js';

export const listUsersMethod = async (args = {}) => {
  const limit = Number.isFinite(args.limit) ? Number(args.limit) : 50;
  const offset = Number.isFinite(args.offset) ? Number(args.offset) : 0;

  const { users, total } = list({ limit, offset });
  return {
    users,
    limit,
    offset,
    total,
  };
};
