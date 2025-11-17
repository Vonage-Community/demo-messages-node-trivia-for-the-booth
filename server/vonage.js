import { Vonage } from '@vonage/server-sdk';
import { getSettings } from './settings.js';

export const getVonageClient = () => {
  const {
    apiKey,
    apiSecret,
  } = getSettings();

  if (!apiKey || !apiSecret) {
    throw {
      code: -32602,
      message: 'Missing API key or secret for Vonage Client',
    };
  }

  return new Vonage({
    apiSecret: apiSecret,
    apiKey: apiKey,
  });
};

export const getMessageClient = () => {
  const {
    applicationId,
    privateKey,
  } = getSettings();

  if (!applicationId || !privateKey) {
    throw {
      code: -32602,
      message: 'Missing Application Id or private key for Vonage client',
    };

  }
  return new Vonage({
    applicationId: applicationId,
    privateKey: privateKey,
  });
};
