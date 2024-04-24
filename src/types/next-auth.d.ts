import NextAuth from 'next-auth/next';

import { JWT } from 'next-auth/jwt';
import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      nickname: string;
      roles: string[];
    } & DefaultSession['user'];
    access_token?: string;
    refresh_token?: string;
    accessTokenExpires?: number;
  }
  interface User {
    nickname: string;
    roles: string[];
  }

  interface Account {
    expires_in: number;
  }
}

declare module '@auth/core/adapters' {
  interface AdapterUser {
    nickname: string;
    roles: string[];
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    user?: {
      nickname: string;
      roles: string[];
    } & DefaultSession['user'] &
      AdapterUser;
    access_token?: string;
    refresh_token?: string;
    accessTokenExpires?: number;
  }
}
