import dotenv from 'dotenv';
import { readFileSync } from 'node:fs';

dotenv.config();

export const privateKey = readFileSync(process.env.VONAGE_PRIVATE_KEY);
