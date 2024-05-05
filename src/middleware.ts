import NextAuth from 'next-auth';

import { authConfig } from './auth.config';

import { NextResponse, userAgent } from 'next/server';

import { CreateServerClient } from './modules/supabase';

const { auth } = NextAuth(authConfig);

export default auth(async (req) => {
  const supabase = CreateServerClient();
  const { data: session } = await supabase
    .schema('next_auth')
    .from('users')
    .select('*')
    .eq('id', req.auth?.user.id!)
    .single();

  // ua: Chrome-Lighthouse

  const { ua } = userAgent(req);

  if (ua === process.env.ADMIN_PWD) return;

  if (req.auth?.user && session) {
    if (session.roles.includes('admin')) return;

    if (session.roles.includes('newbie') && req.nextUrl.pathname === '/') {
      return NextResponse.redirect(new URL('/like', req.url));
    }

    if (
      !session.roles.includes('newbie') &&
      req.nextUrl.pathname.startsWith('/like')
    ) {
      return NextResponse.redirect(new URL('/', req.url));
    }

    if (req.nextUrl.pathname.startsWith('/login')) {
      return NextResponse.redirect(new URL('/', req.url));
    }
  } else {
    if (req.nextUrl.pathname.startsWith('/like')) {
      return NextResponse.redirect(new URL('/', req.url));
    }

    if (req.nextUrl.pathname.startsWith('/user')) {
      return NextResponse.redirect(new URL('/', req.url));
    }
  }
});

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
