import { existsSync, writeFileSync, readFileSync } from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import debug from './log.js';

const log = debug.extend('key');

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const keyFile = path.join(__dirname, '..', 'data', 'trivia.key');

export const getTriviaKey = () => {
  if (!existsSync(keyFile)) {
    log('Creating private key', keyFile);
    const { privateKey } = crypto.generateKeyPairSync('rsa', {
      modulusLength: 2048,
      privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
      publicKeyEncoding: { type: 'spki', format: 'pem' },
    });

    writeFileSync(keyFile, privateKey);
  }

  log('Reading key', keyFile);
  return readFileSync(keyFile, 'utf8');
};
