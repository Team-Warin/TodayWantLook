import NextAuth from 'next-auth';

import { authConfig } from './auth.config';

import { SupabaseAdapter } from '@auth/supabase-adapter';

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  adapter: SupabaseAdapter({
    url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    secret: process.env.NEXT_PUBLIC_SUPABASE_ROLE_KEY!,
  }),
});
