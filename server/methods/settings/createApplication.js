import { setSetting, getSettings } from '../../settings.js';
import { getVonageClient } from '../../vonage.js';
import debug from './log.js';

const generateHexCode = () => {
  const letters = 'ABCDEF1234567890';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += letters.charAt(Math.floor(Math.random() * letters.length));
  }
  return code;
};

const log = debug.extend('create_app');

export const createApplicationMethod = async () => {
  log('Creating application');

  const appData = {
    name: `Booth Trivia - ${generateHexCode()}`,
    privacy: {
      improveAI: false,
    },
  };

  const newApplication = await getVonageClient().applications.createApplication(appData);
  log('New application', newApplication);

  setSetting('privateKey', newApplication.keys.privateKey);
  setSetting('applicationId', newApplication.id);
  setSetting('applicationName', newApplication.name);
  const { privateKey, apiSecret, ...settings } = getSettings();
  return {
    apiSecret: apiSecret ? '*****' : null,
    privateKey: privateKey ? '*****' : null,
    ...settings,
  };
};
