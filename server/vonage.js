import { readFileSync } from 'node:fs';

export const privateKey = readFileSync(process.env.VONAGE_PRIVATE_KEY);
