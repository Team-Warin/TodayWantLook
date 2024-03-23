import { DefaultSession } from 'next-auth';
import NextAuth from 'next-auth/next';

interface MediaData {
  mediaId: string;
  type: string;
  rate: number;
  check: { like: boolean; rate: boolean };
}

declare module 'next-auth' {
  interface Session {
    user: {
      nickname: string;
      likes: boolean;
      rates: MediaData[];
    } & DefaultSession['user'];
  }

  interface User {
    likes: boolean;
    rates: MediaData[];
  }
}
