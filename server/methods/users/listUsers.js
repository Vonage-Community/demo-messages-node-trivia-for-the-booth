import { listUsers } from '../../../service/users/listUsers.js';
import debug from './log.js';

const log = debug.extend('list');

export const listUsersMethod = async (args = {}) => {
  log('Listing users');
  const limit = Number.isFinite(args.limit) ? Number(args.limit) : 50;
  const offset = Number.isFinite(args.offset) ? Number(args.offset) : 0;
  const detailed = args._auth.role;

  log('Users role', detailed);

  const { users, total } = listUsers(
    { limit, offset },
    args._auth.role === 'admin',
  );

  return {
    users,
    limit,
    offset,
    total,
  };
};
