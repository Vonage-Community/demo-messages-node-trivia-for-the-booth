import Database from 'better-sqlite3';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { ensureSchema } from './schemas/index.js';
import log from './log.js';

log('Initlizing Database');

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const resolvedDbPath = (() => {
  if (process.env.SQLITE_DB) {
    return process.env.SQLITE_DB;
  }

  const dataDir = path.join(__dirname, '..', 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  return path.join(dataDir, 'trivia.sqlite');
})();

const db = new Database(resolvedDbPath);

if (resolvedDbPath !== ':memory:' && process.env.SQLITE_DISABLE_WAL !== '1') {
  db.pragma('journal_mode = WAL');
}

db.pragma('foreign_keys = OFF');

log('SQLite initialized');

export default db;

if (process.env.SKIP_MIGRATIONS !== '1') {
  ensureSchema();
}
