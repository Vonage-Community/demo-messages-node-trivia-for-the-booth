import { getVonageClient } from '../../vonage.js';
import { getSettings, setSetting } from '../../settings.js';
import debug from './log.js';

const log = debug.extend('owned_numbers');

export const getOwnedNumbersMethod = async () => {
  log('Getting owned numbers');
  const { applicationId, numbers } = await getSettings();
  const ownedNumbers = await getVonageClient().numbers.getOwnedNumbers();
  log('Owned Numbers', ownedNumbers);
  if (!applicationId) {
    return ownedNumbers;
  }

  const appNumbers = ownedNumbers.numbers.filter(({ app_id }) => app_id === applicationId);
  setSetting('numbers', appNumbers);

  return ownedNumbers;
};
