import { createClient } from '@supabase/supabase-js'

export const supabaseConfig = {
  url: process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ohzzqvipvlgsfyrauzsx.supabase.co',
  anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
};

// Create Supabase client
export const supabase = createClient(
  supabaseConfig.url,
  supabaseConfig.anonKey
);

// Environment variables you need to set in .env.local:
// NEXT_PUBLIC_SUPABASE_URL=https://ohzzqvipvlgsfyrauzsx.supabase.co
// NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
