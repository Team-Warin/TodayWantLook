'use client';

import type { Session } from 'next-auth';

import Link from 'next/link';
import Image from 'next/image';

import style from '@/styles/Navbar.module.css';

import { Button } from '@nextui-org/react';
import { signIn, signOut } from 'next-auth/react';

export default function Navbar({ session }: { session: Session | null }) {
  return (
    <div className={`w-full h-[80px] ${style.container}`}>
      <div
        className={`flex justify-between items-center w-full h-full rounded-xl shadow-lg ${style.navbar}`}
      >
        <Link href='/'>TodayWantLook</Link>
        {session?.user.image ? (
          <Image
            className={`${style.user}`}
            width={45}
            height={45}
            placeholder='blur'
            blurDataURL='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAFklEQVR42mN8//HLfwYiAOOoQvoqBABbWyZJf74GZgAAAABJRU5ErkJggg=='
            src={session?.user.image}
            alt='user'
            onClick={() => signOut()}
          ></Image>
        ) : (
          <Button className={`${style.btn}`} onClick={() => signIn()}>
            Sign In
          </Button>
        )}
      </div>
    </div>
  );
}
