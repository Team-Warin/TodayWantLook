import type { JWT } from 'next-auth/jwt';
import type { NextAuthConfig } from 'next-auth';
import type { Provider } from 'next-auth/providers';

import { nameCreate } from './modules/nickname';
import Google from 'next-auth/providers/google';

const GOOGLE_AUTHORIZATION_URL =
  'https://accounts.google.com/o/oauth2/v2/auth?' +
  new URLSearchParams({
    prompt: 'consent',
    access_type: 'offline',
    response_type: 'code',
  });

async function refreshAccessToken(token: JWT) {
  try {
    const url =
      'https://oauth2.googleapis.com/token?' +
      new URLSearchParams({
        client_id: process.env.AUTH_GOOGLE_ID ?? '',
        client_secret: process.env.AUTH_GOOGLE_SECRET ?? '',
        grant_type: 'refresh_token',
        refresh_token: token.refresh_token ?? '',
      });

    const res = await fetch(url, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      method: 'POST',
    });

    const refreshedTokens = await res.json();

    if (!res.ok) throw refreshedTokens;

    return {
      ...token,
      access_token: refreshedTokens.access_token,
      accessTokenExpires:
        Math.round(Date.now() / 1000) + refreshedTokens.expires_in,
      refresh_token: refreshedTokens.refresh_token ?? token.refresh_token,
    };
  } catch (e) {
    console.error(e);

    return token;
  }
}

const providers: Provider[] = [
  Google({
    authorization: GOOGLE_AUTHORIZATION_URL,
    allowDangerousEmailAccountLinking: true,
    profile(profile) {
      return {
        id: profile.sub,
        name: profile.name,
        nickname: nameCreate(),
        email: profile.email,
        image: profile.picture,
        roles: ['newbie'],
      };
    },
  }),
];

export const providerMap = providers.map((provider) => {
  if (typeof provider === 'function') {
    const providerData = provider();
    return { id: providerData.id, name: providerData.name };
  } else {
    return { id: provider.id, name: provider.name };
  }
});

export const authConfig = {
  debug: false,
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30d
  },
  pages: {
    signIn: '/login',
  },
  providers,
  callbacks: {
    signIn: async ({ user, account, profile }) => {
      return true;
    },
    jwt: async ({ token, user, account, trigger }) => {
      if (user && account?.expires_in) {
        return {
          /** 닉네임 및 Token 권한 설정 */
          user,
          /** Acces Token 및 Refresh Token 설정 */
          access_token: account.access_token,
          refresh_token: account.refresh_token,
          accessTokenExpires:
            Math.round(Date.now() / 1000) + account.expires_in,
        };
      }

      if (trigger === 'update' && token.email) {
        const res = await fetch(`${process.env.NEXTAUTH_URL}/api/user`, {
          method: 'POST',
          body: JSON.stringify({
            email: token.email,
            key: process.env.API_KEY,
          }),
        });

        if (res.ok) {
          const data = await res.json();

          token.nickname = data.nickname;
          token.roles = data.roles;
        }
      }

      if (token.accessTokenExpires) {
        if (Math.round(Date.now() / 1000) < token.accessTokenExpires) {
          return token;
        }
      }

      return refreshAccessToken(token);
    },
    session: async ({ session, token }) => {
      if (token.user && session) {
        /** 닉네임 및 Token 권한 설정 */
        session.user = token.user;
        /** Acces Token 및 Refresh Token 설정 */
        session.access_token = token.access_token;
        session.refresh_token = token.refresh_token;
        session.accessTokenExpires = token.accessTokenExpires;
      }

      return session;
    },
  },
} satisfies NextAuthConfig;
