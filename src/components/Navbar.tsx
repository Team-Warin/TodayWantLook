'use client';

import type { Session } from 'next-auth';
import Link from 'next/link';
import Image from 'next/image';

import style from '@/styles/Navbar.module.css';

import { signIn, signOut } from 'next-auth/react';

export default function Navbar({ session }: { session: Session | null }) {
  return (
    <div className={'w-full h-[80px] p-3'}>
      <div
        className={`flex justify-between items-center w-full h-full rounded-xl shadow-lg p-4 ${style.navbar}`}
      >
        <Link href='/'>TodayWantLook</Link>
        {session?.user.image ? (
          <Image
            className={`${style.user}`}
            width={45}
            height={45}
            src={session?.user.image}
            alt='user'
            onClick={() => signOut()}
          ></Image>
        ) : (
          <button onClick={() => signIn()}>Sign In / Sign Up</button>
        )}
      </div>
    </div>
  );
}
