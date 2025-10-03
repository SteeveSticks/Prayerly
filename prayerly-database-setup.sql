-- Prayerly Database Setup - Complete & Fixed
-- Run this in your Supabase SQL Editor

-- 1. Create prayer_reply table
CREATE TABLE prayer_reply (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  prayer_id uuid NOT NULL REFERENCES prayer(id) ON DELETE CASCADE,
  author varchar NOT NULL, -- Clerk user ID as string (not UUID)
  content text NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- 2. Create profiles table for user info
CREATE TABLE profiles (
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
  FOR INSERT WITH CHECK ((SELECT auth.jwt()) IS NOT NULL);

-- Only reply authors can update their replies
CREATE POLICY "Authors can update their replies" ON prayer_reply
  FOR UPDATE USING (
    (SELECT auth.jwt()) IS NOT NULL AND 
    author = (SELECT auth.jwt() ->> 'sub')
  );

-- Only reply authors can delete their replies
CREATE POLICY "Authors can delete their replies" ON prayer_reply
  FOR DELETE USING (
    (SELECT auth.jwt()) IS NOT NULL AND 
    author = (SELECT auth.jwt() ->> 'sub')
  );

-- 5. RLS Policies for profiles
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

-- 6. Enable Realtime for prayer_reply table
ALTER PUBLICATION supabase_realtime ADD TABLE prayer_reply;

-- 7. Create indexes for better performance
CREATE INDEX idx_prayer_reply_prayer_id ON prayer_reply(prayer_id);
CREATE INDEX idx_prayer_reply_author ON prayer_reply(author);
CREATE INDEX idx_prayer_reply_created_at ON prayer_reply(created_at);

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

-- 11. Insert some test data (optional - remove if not needed)
-- INSERT INTO profiles (id, full_name, avatar_url) VALUES 
-- ('user_32Oe15Wf5GkPZ1fMyGj2NjWLYFu', 'Test User', 'https://example.com/avatar.jpg');

-- Success message
SELECT 'Prayerly database setup completed successfully!' as status;
