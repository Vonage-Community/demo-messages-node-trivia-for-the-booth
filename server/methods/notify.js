import { listUsers } from '../../service/users/listUsers.js';
import { vonageClient } from '../vonage.js';
import dotenv from 'dotenv';
import { SMS } from '@vonage/messages';
import debug from './log.js';

const fromNumber = process.env.VONAGE_FROM_NUMBER;
dotenv.config();

const log = debug.extend('notify');

const sendMessageToUser = (user, index) => {
  if (user.role === 'admin' || !user.phone) {
    return;
  }

  try {
    const phone = user.phone.startsWith('1') ? user.phone : `1${user.phone}`;
    log('Notifying user', user);
    setTimeout(() => {
      try {
        vonageClient.messages.send(new SMS({
          from: fromNumber,
          to: phone,
          text: 'A new round of trivia has started. Visit the Vonage booth if you need the link again.',
        }));
      } catch (error) {
        log('Error', error);
      }
    }, 100 * index);
  } catch (error) {
    log('Error sending message', error);
  }
};

export const notifyMethod = async () => {
  log('Number');

  const { users } = listUsers({ limit: 1000 }, true);
  users.forEach(sendMessageToUser);
};

