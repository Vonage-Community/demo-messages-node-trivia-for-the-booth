import { requireLogin } from '../../auth.js';
import { getSettingsMethod } from './getSettings.js';
import { setSettingsMethod } from './setSettings.js';
import { createApplicationMethod } from './createApplication.js';
import { getOwnedNumbersMethod } from './ownedNumbers.js';
import { linkNumberMethod } from './linkNumber.js';

export const settings = {
  get: requireLogin(getSettingsMethod, 'admin'),
  set: requireLogin(setSettingsMethod, 'admin'),
  create_app: requireLogin(createApplicationMethod, 'admin'),
  owned_numbers: requireLogin(getOwnedNumbersMethod, 'admin'),
  link_number: requireLogin(linkNumberMethod, 'admin'),
};
