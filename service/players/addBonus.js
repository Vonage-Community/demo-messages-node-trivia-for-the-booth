import db from '../../db/index.js';
import {
  requireNonEmptyString,
  requireUInt,
} from '../helpersAndGuards.js';
import debug from './log.js';

const log = debug.extend('add_bonus');

export const insertBonus = db.prepare(`
  INSERT INTO scores (user_id, score_type, score_points)
  VALUES (@userId, @scoreType, @scorePoints)
`);

export const createBonus = (args = {}) => {
  log('Creating', args);

  const {
    playerId,
    scoreType,
    scorePoints,
  } = args;

  const bonus = {
    scoreType: requireNonEmptyString('scoreType', scoreType),
    scorePoints: requireUInt('scorePoints', scorePoints),
    userId: playerId,
  };

  log('Bonus to create', bonus);

  const info = insertBonus.run(bonus);

  return {
    id: info.lastInsertRowid,
    playerId,
    scoreType,
    scorePoints,
  };
};
