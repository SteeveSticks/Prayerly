-- Prayerly Database Setup Script
-- Run this in your Supabase SQL Editor

-- 1. Create prayer_reply table (if it doesn't exist)
CREATE TABLE IF NOT EXISTS prayer_reply (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  prayer_id uuid NOT NULL REFERENCES prayer(id) ON DELETE CASCADE,
  author text NOT NULL, -- Changed from uuid to text for Clerk user IDs
  content text NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- 2. Create profiles table (optional - for storing user names/avatars)
CREATE TABLE IF NOT EXISTS profiles (
  id text PRIMARY KEY, -- Clerk user ID
  full_name text,
  avatar_url text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- 3. Enable Row Level Security
ALTER TABLE prayer_reply ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policies for prayer_reply
-- Allow everyone to read replies
CREATE POLICY "Anyone can read prayer replies" ON prayer_reply
  FOR SELECT USING (true);

-- Only authenticated users can insert replies
CREATE POLICY "Authenticated users can create replies" ON prayer_reply
  FOR INSERT WITH CHECK (auth.uid()::text = author);

-- Only reply authors can update their replies
CREATE POLICY "Authors can update their replies" ON prayer_reply
  FOR UPDATE USING (auth.uid()::text = author);

-- Only reply authors can delete their replies
CREATE POLICY "Authors can delete their replies" ON prayer_reply
  FOR DELETE USING (auth.uid()::text = author);

-- 5. RLS Policies for profiles
-- Allow everyone to read profiles
CREATE POLICY "Anyone can read profiles" ON profiles
  FOR SELECT USING (true);

-- Users can insert their own profile
CREATE POLICY "Users can create their own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid()::text = id);

-- Users can update their own profile
CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid()::text = id);

-- 6. Enable Realtime for prayer_reply table
ALTER PUBLICATION supabase_realtime ADD TABLE prayer_reply;

-- 7. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_prayer_reply_prayer_id ON prayer_reply(prayer_id);
CREATE INDEX IF NOT EXISTS idx_prayer_reply_author ON prayer_reply(author);
CREATE INDEX IF NOT EXISTS idx_prayer_reply_created_at ON prayer_reply(created_at);

-- 8. Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- 9. Create triggers for updated_at
CREATE TRIGGER update_prayer_reply_updated_at 
  BEFORE UPDATE ON prayer_reply 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at 
  BEFORE UPDATE ON profiles 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 10. Grant necessary permissions
GRANT ALL ON prayer_reply TO authenticated;
GRANT ALL ON profiles TO authenticated;
GRANT USAGE ON SCHEMA public TO authenticated;
