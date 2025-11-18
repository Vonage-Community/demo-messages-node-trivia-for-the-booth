import { setSetting, getSettings } from '../../settings.js';
import { getVonageClient } from '../../vonage.js';
import debug from './log.js';

const log = debug.extend('link_number');

export const linkNumberMethod = async ({ msisdn }) => {
  log('Linking number', msisdn);
  const { applicationId, numbers } = await getSettings();
  if (!applicationId) {
    throw {
      code: -32004,
      message: 'No application configured',
    };
  }

  const ownedNumbers = await getVonageClient().numbers.getOwnedNumbers({
    pattern: msisdn,
  });

  const number = ownedNumbers?.numbers[0];

  if (!number) {
    throw {
      code: -32404,
      message: 'Number is not owned by this account',
    };
  }

  if (number.app_id !== applicationId) {
    log('Number not linked, linking');
    number.appId = applicationId;
    await getVonageClient().numbers.updateNumber(number);
    numbers.push(number);
    log('Number linked', numbers);
    setSetting('numbers', numbers);
  }

  return ownedNumbers;
};
