import { updateUser } from '../../../service/users.js';

export const updateUserMethod = async ({ id, ...args }) => await updateUser(id, args);
