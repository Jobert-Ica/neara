import { createClient } from "@supabase/supabase-js";

// Server-side client (with service role for admin operations)
export const supabaseAdmin = typeof window === "undefined"
  ? createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    )
  : (null as any);

// Client-side Supabase (for Realtime subscriptions)
export const createSupabaseClient = () =>
  createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
