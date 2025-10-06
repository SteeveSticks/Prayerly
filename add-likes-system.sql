-- Add likes/encouragements table to existing schema
-- Run this in your Supabase SQL Editor

-- 1. Create prayer_likes table for encourage functionality
CREATE TABLE prayer_likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  prayer_id uuid NOT NULL REFERENCES prayer(id) ON DELETE CASCADE,
  user_id varchar NOT NULL, -- Clerk user ID
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE(prayer_id, user_id) -- Prevent duplicate likes from same user
);

-- 2. Enable Row Level Security
ALTER TABLE prayer_likes ENABLE ROW LEVEL SECURITY;

-- 3. RLS Policies for prayer_likes
-- Allow everyone to read likes
CREATE POLICY "Anyone can read prayer likes" ON prayer_likes
  FOR SELECT USING (true);

-- Only authenticated users can like/unlike
CREATE POLICY "Authenticated users can like prayers" ON prayer_likes
  FOR INSERT WITH CHECK (
    (SELECT auth.jwt()) IS NOT NULL AND 
    user_id = (SELECT auth.jwt() ->> 'sub')
  );

-- Users can delete their own likes (unlike)
CREATE POLICY "Users can unlike prayers" ON prayer_likes
  FOR DELETE USING (
    (SELECT auth.jwt()) IS NOT NULL AND 
    user_id = (SELECT auth.jwt() ->> 'sub')
  );

-- 4. Enable Realtime for prayer_likes
ALTER PUBLICATION supabase_realtime ADD TABLE prayer_likes;

-- 5. Create indexes for performance
CREATE INDEX idx_prayer_likes_prayer_id ON prayer_likes(prayer_id);
CREATE INDEX idx_prayer_likes_user_id ON prayer_likes(user_id);

-- 6. Grant permissions
GRANT ALL ON prayer_likes TO authenticated;

-- Success message
SELECT 'Prayer likes system added successfully!' as status;
