CREATE TABLE IF NOT EXISTS notes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  note TEXT NOT NULL,
  email TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);