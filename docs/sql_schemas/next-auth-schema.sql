-- FINAL DEFINITIVE Schema for Auth.js Supabase Adapter
-- Matches @auth/supabase-adapter source code exactly.

CREATE SCHEMA IF NOT EXISTS next_auth;

-- Users table
CREATE TABLE IF NOT EXISTS next_auth.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT,
  email TEXT UNIQUE,
  "emailVerified" TIMESTAMP WITH TIME ZONE,
  image TEXT,
  password TEXT
);

-- Accounts table
CREATE TABLE IF NOT EXISTS next_auth.accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL,
  provider TEXT NOT NULL,
  "providerAccountId" TEXT NOT NULL,
  refresh_token TEXT,
  access_token TEXT,
  expires_at BIGINT,
  token_type TEXT,
  scope TEXT,
  id_token TEXT,
  session_state TEXT,
  oauth_token_secret TEXT,
  oauth_token TEXT,
  "userId" UUID REFERENCES next_auth.users(id) ON DELETE CASCADE
);

-- Sessions table
CREATE TABLE IF NOT EXISTS next_auth.sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  expires TIMESTAMP WITH TIME ZONE NOT NULL,
  "sessionToken" TEXT UNIQUE NOT NULL,
  "userId" UUID REFERENCES next_auth.users(id) ON DELETE CASCADE
);

-- Verification Tokens table
CREATE TABLE IF NOT EXISTS next_auth.verification_tokens (
  id SERIAL PRIMARY KEY,
  identifier TEXT,
  token TEXT UNIQUE,
  expires TIMESTAMP WITH TIME ZONE NOT NULL
);

-- Permissions (Ensure service_role can see and manage the schema)
GRANT USAGE ON SCHEMA next_auth TO service_role;
GRANT ALL ON ALL TABLES IN SCHEMA next_auth TO service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA next_auth TO service_role;
