import NextAuth from 'next-auth';

import { authConfig } from './auth.config';

import { NextResponse, userAgent } from 'next/server';

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  console.log(userAgent(req), req.nextUrl.pathname);
  if (req.auth?.user) {
    if (!req.auth.user.roles.includes('user') && req.nextUrl.pathname === '/') {
      return NextResponse.redirect(new URL('/like', req.url));
    }

    if (
      req.auth.user.roles.includes('user') &&
      req.nextUrl.pathname.startsWith('/like')
    ) {
      return NextResponse.redirect(new URL('/', req.url));
    }

    if (req.nextUrl.pathname.startsWith('/login')) {
      return NextResponse.redirect(new URL('/', req.url));
    }
  } else {
  }
});
export const config = {
  matcher: ['/(.*)'],
};
