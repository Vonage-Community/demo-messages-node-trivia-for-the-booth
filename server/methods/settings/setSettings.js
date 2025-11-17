import { setSetting, getSettings } from '../../settings.js';
import debug from './log.js';

const log = debug.extend('set');

export const setSettingsMethod = async (args) => {
  log('Set settings', args);
  Object.entries(args).forEach(([setting, value]) => {
    if (setting === '_auth') {
      return;
    }

    setSetting(setting, value);
  });

  return getSettings();
};
