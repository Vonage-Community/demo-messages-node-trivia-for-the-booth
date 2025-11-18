import { getSettings } from '../../settings.js';
import debug from './log.js';

const log = debug.extend('get');

export const getSettingsMethod = async () => {
  log('Getting settings');
  const { privateKey, apiSecret, openAPIKey, ...settings } = getSettings();
  return {
    apiSecret: apiSecret ? '*****' : null,
    privateKey: privateKey ? '*****' : null,
    openAPIKey: openAPIKey ? '*****' : null,
    ...settings,
  };
};
