-- Fixed Prayerly Database Setup Script
-- Run this in your Supabase SQL Editor

-- 1. Drop existing policies first (if they exist)
DROP POLICY IF EXISTS "Anyone can read prayer replies" ON prayer_reply;
DROP POLICY IF EXISTS "Authenticated users can create replies" ON prayer_reply;
DROP POLICY IF EXISTS "Authors can update their replies" ON prayer_reply;
DROP POLICY IF EXISTS "Authors can delete their replies" ON prayer_reply;

-- 2. Create prayer_reply table (if it doesn't exist)
CREATE TABLE IF NOT EXISTS prayer_reply (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  prayer_id uuid NOT NULL REFERENCES prayer(id) ON DELETE CASCADE,
  author varchar NOT NULL, -- Clerk user ID as string
  content text NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- 3. Create profiles table (optional - for storing user names/avatars)
CREATE TABLE IF NOT EXISTS profiles (
  id text PRIMARY KEY, -- Clerk user ID
  full_name text,
  avatar_url text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- 4. Enable Row Level Security
ALTER TABLE prayer_reply ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 5. FIXED RLS Policies for prayer_reply
-- Allow everyone to read replies
CREATE POLICY "Anyone can read prayer replies" ON prayer_reply
  FOR SELECT USING (true);

-- Only authenticated users can insert replies (using JWT check)
CREATE POLICY "Authenticated users can create replies" ON prayer_reply
  FOR INSERT WITH CHECK ((SELECT auth.jwt()) IS NOT NULL);

-- Only reply authors can update their replies (using JWT + author comparison)
CREATE POLICY "Authors can update their replies" ON prayer_reply
  FOR UPDATE USING (
    (SELECT auth.jwt()) IS NOT NULL AND 
    author = (SELECT auth.jwt() ->> 'sub')
  );

-- Only reply authors can delete their replies (using JWT + author comparison)
CREATE POLICY "Authors can delete their replies" ON prayer_reply
  FOR DELETE USING (
    (SELECT auth.jwt()) IS NOT NULL AND 
    author = (SELECT auth.jwt() ->> 'sub')
  );

-- 6. RLS Policies for profiles
-- Allow everyone to read profiles
CREATE POLICY "Anyone can read profiles" ON profiles
  FOR SELECT USING (true);

-- Users can insert their own profile
CREATE POLICY "Users can create their own profile" ON profiles
  FOR INSERT WITH CHECK (
    (SELECT auth.jwt()) IS NOT NULL AND 
    id = (SELECT auth.jwt() ->> 'sub')
  );

-- Users can update their own profile
CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (
    (SELECT auth.jwt()) IS NOT NULL AND 
    id = (SELECT auth.jwt() ->> 'sub')
  );

-- 7. Enable Realtime for prayer_reply table (safe version)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' 
        AND tablename = 'prayer_reply'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE prayer_reply;
    END IF;
END $$;

-- 8. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_prayer_reply_prayer_id ON prayer_reply(prayer_id);
CREATE INDEX IF NOT EXISTS idx_prayer_reply_author ON prayer_reply(author);
CREATE INDEX IF NOT EXISTS idx_prayer_reply_created_at ON prayer_reply(created_at);

-- 9. Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- 10. Create triggers for updated_at
CREATE TRIGGER update_prayer_reply_updated_at 
  BEFORE UPDATE ON prayer_reply 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at 
  BEFORE UPDATE ON profiles 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 11. Grant necessary permissions
GRANT ALL ON prayer_reply TO authenticated;
GRANT ALL ON profiles TO authenticated;
GRANT USAGE ON SCHEMA public TO authenticated;
