-- Dragonfly Training: shared persistent data
CREATE TABLE IF NOT EXISTS app_records (
  record_key TEXT PRIMARY KEY,
  record_value TEXT NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS app_users (
  user_id TEXT PRIMARY KEY,
  role TEXT NOT NULL CHECK (role IN ('manager','staff')),
  display_name TEXT NOT NULL,
  credential_hash TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS app_sessions (
  token_hash TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  expires_at INTEGER NOT NULL,
  created_at INTEGER NOT NULL,
  FOREIGN KEY (user_id) REFERENCES app_users(user_id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_app_sessions_user ON app_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_app_sessions_expiry ON app_sessions(expires_at);
