import type { Adapter } from 'next-auth/adapters';
import type { Session, User } from 'next-auth';

import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

import { connectDB } from '@/modules/database';
import { MongoDBAdapter } from '@auth/mongodb-adapter';
import { nameCreate } from '@/modules/nickname';

export const authOptions = {
  secret: process.env.JWT_SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
      allowDangerousEmailAccountLinking: true,
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          nickname: nameCreate(),
          email: profile.email,
          image: profile.picture,
          likes: false,
        };
      },
    }),
  ],
  pages: {
    signIn: '/signin',
  },
  adapter: MongoDBAdapter(connectDB, {
    databaseName: process.env.DB_NAME,
  }) as Adapter,
  callbacks: {
    async session({ session, user }: { session: Session; user: User }) {
      session.user.likes = user.likes;
      session.user.nickname = user.nickname;
      return session;
    },
  },
};

export default NextAuth(authOptions);
