import { createBonus } from '../../../service/players/addBonus.js';
import debug from './log.js';

const log = debug.extend('create');

export const addBonusMethod = async (args) => {
  log('Adding Bonus');
  return createBonus(args);
};

