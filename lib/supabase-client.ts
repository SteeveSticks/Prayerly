import { createClient } from "@supabase/supabase-js";

// Client-side Supabase client (no auth)
export const createClientSupabase = () => {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
};
