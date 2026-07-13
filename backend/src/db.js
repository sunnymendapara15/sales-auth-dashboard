const path = require('path');
const fs = require('fs');
const Database = require('better-sqlite3');

const dbFile = process.env.DATABASE_FILE
  ? path.resolve(process.env.DATABASE_FILE)
  : path.resolve(__dirname, '../data/dev.db');

fs.mkdirSync(path.dirname(dbFile), { recursive: true });

const db = new Database(dbFile);

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'sales',
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
`);

module.exports = db;
