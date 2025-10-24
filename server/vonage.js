import { Vonage } from '@vonage/server-sdk';
import dotenv from 'dotenv';
import { readFileSync } from 'node:fs';

dotenv.config();

export const privateKey = readFileSync(process.env.VONAGE_PRIVATE_KEY);

export const vonageClient = new Vonage({
  applicationId: process.env.VONAGE_APPLICATION_ID,
  privateKey: process.env.VONAGE_PRIVATE_KEY,
  apiSecret: process.env.VONAGE_API_SECRET,
  apiKey: process.env.VONAGE_API_KEY,
});
