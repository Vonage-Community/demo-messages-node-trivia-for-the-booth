import { listUsers } from '../../service/users/listUsers.js';
import { vonageClient } from '../vonage.js';
import dotenv from 'dotenv';
import { SMS } from '@vonage/messages';
import debug from './log.js';

const fromNumber = process.env.VONAGE_FROM_NUMBER;
dotenv.config();

const log = debug.extend('notify');

export const notifyMethod = async (args) => {
  log('Number');

  const { users } = listUsers({ limit: 1000 }, true);
  users.forEach((user) => {
    if (user.role === 'admin' || !user.notify) {
      return;
    }

    log('Notifying user', user);
    vonageClient.messages.send(new SMS({
      from: fromNumber,
      to: user.phone,
      text: 'A new round of trivia has started. Visit the Vonage booth if you need the link again.',
    }));
  });
};

