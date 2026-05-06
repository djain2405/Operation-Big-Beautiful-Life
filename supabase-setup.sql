-- Run this in your Supabase SQL Editor (https://supabase.com/dashboard → SQL Editor)

CREATE TABLE life_data (
  user_id TEXT PRIMARY KEY,
  data JSONB NOT NULL DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Allow public read/write (this is a personal app)
ALTER TABLE life_data ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all access" ON life_data
  FOR ALL
  USING (true)
  WITH CHECK (true);
