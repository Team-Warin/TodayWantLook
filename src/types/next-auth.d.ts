import { DefaultSession } from 'next-auth';
import NextAuth from 'next-auth/next';

interface MediaData {
  type: string;
  MediaId: number;
  rate: number;
  check: {
    view: boolean;
    rate: boolean;
  };
}

declare module 'next-auth' {
  interface Session {
    user: {
      nickname?: string | undefined | null;
      likes?: boolean | undefined | null;
      rates?: (MediaData | null)[] | undefined | null;
    } & DefaultSession['user'];
  }

  interface User {
    likes?: boolean | undefined | null;
    rates?: (MediaData | null)[] | undefined | null;
  }
}
