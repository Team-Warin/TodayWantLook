import NextAuth from 'next-auth';

import { authConfig } from './auth.config';

import { connectDB } from './modules/database';
import { MongoDBAdapter } from '@auth/mongodb-adapter';

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  adapter: MongoDBAdapter(connectDB, {
    databaseName: process.env.DB_NAME,
  }),
});
