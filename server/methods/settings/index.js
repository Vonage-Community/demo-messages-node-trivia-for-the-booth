import { requireLogin } from '../../auth.js';
import { getSettingsMethod } from './getSettings.js';
import { setSettingsMethod } from './setSettings.js';
import { createApplicationMethod } from './createApplication.js';

export const settings = {
  get: requireLogin(getSettingsMethod, 'admin'),
  set: requireLogin(setSettingsMethod, 'admin'),
  create_app: requireLogin(createApplicationMethod, 'admin'),
};
