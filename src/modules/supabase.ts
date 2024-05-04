import type { CookieOptions } from '@supabase/ssr';
import type { Database as TodayWantLook } from '@/types/supabase-twl';
import type { Database as NextAuth } from '@/types/supabase-next_auth';

import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';

export function CreateServerClient() {
  const cookieStore = cookies();

  return createServerClient<NextAuth & TodayWantLook>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ROLE_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch (error) {}
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options });
          } catch (error) {}
        },
      },
    }
  );
}

export function CreateClient() {
  return createClient<NextAuth & TodayWantLook>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ROLE_KEY!
  );
}
