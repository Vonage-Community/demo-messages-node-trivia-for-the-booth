import { writeFileSync, readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import debug from './log.js';

const log = debug.extend('settings');

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const settingsFile = path.join(__dirname, '..', 'data', 'settings.json');
log('Settings file', settingsFile);

export const defaultSettings = {
  apiKey: null,
  apiSecret: null,
  applicationName: null,
  applicationId: null,
  privateKey: null,
  openAPIKey: null,
  numbers: [],
};

const loadSettings = () => {
  log('Loading settings');

  if (!existsSync(settingsFile)) {
    saveSettings(defaultSettings);
  }

  const data = readFileSync(settingsFile, 'utf-8');
  const settings = JSON.parse(data);

  return settings;
};

const saveSettings = (settings) => {
  log('Saving settings');
  writeFileSync(settingsFile, JSON.stringify(settings, null, 2));
  log('Settings Saved!');
};

export const setSetting = (setting, value) => {
  log(`Setting ${setting}`);
  if (!Object.keys(defaultSettings).includes(setting)) {
    throw {
      code: 400,
      message: `Invalid setting ${setting}`,
    };
  }

  const settings = getSettings();

  settings[setting] = value;
  saveSettings(settings);
  return settings;
};

export const getSettings = () => loadSettings();
