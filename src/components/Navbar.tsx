'use client';

import type { Session } from 'next-auth';

import style from '@/styles/Navbar.module.css';

import { usePathname } from 'next/navigation';

import Link from 'next/link';
import Image from 'next/image';

import Logout from '@/action/logout';

import { Avatar } from '@nextui-org/avatar';
import { Button } from '@nextui-org/button';
import { Listbox, ListboxItem } from '@nextui-org/listbox';
import { Popover, PopoverTrigger, PopoverContent } from '@nextui-org/popover';

/**
 * Navbar UI Components
 */
export default function Navbar({ session }: { session: Session | null }) {
  const pathname = usePathname();

  const navMenu: { name: string; url: string; disblePage?: string[] }[] = [
    { name: '태그 검색', url: '/search' },
  ];

  if (pathname?.startsWith('/login') || pathname?.startsWith('/api/auth'))
    return <></>;

  return (
    <div
      className={`${style.container} ${pathname === '/' ? 'fixed' : 'relative'}`}
    >
      <div
        className={`${style.container} p-10 ${pathname === '/' ? 'fixed' : 'absolute'}`}
      >
        <div className='flex items-center gap-6'>
          <Link href='/'>
            <Image src={'/Logo.webp'} width={75} height={75} alt='logo'></Image>
          </Link>
          <div>
            {navMenu.map((menu, i: number) => {
              return (
                <Link
                  key={i}
                  className={`${pathname === menu.url ? 'text-twl' : ''} transition-colors`}
                  href={menu.url}
                >
                  {menu.name}
                </Link>
              );
            })}
          </div>
        </div>
        <div>
          {session?.user.image ? (
            <Popover placement='bottom-end'>
              <PopoverTrigger>
                <Avatar
                  isBordered
                  className='cursor-pointer'
                  src={session.user.image}
                />
              </PopoverTrigger>
              <PopoverContent>
                <Listbox aria-label='UserAuth'>
                  <ListboxItem key='mypage'>
                    <Link href={'/user/mypage'}>마이페이지</Link>
                  </ListboxItem>
                  <ListboxItem key='auth'>
                    <Link href={'/user/auth'}>계정 정보</Link>
                  </ListboxItem>
                  <ListboxItem
                    key='logout'
                    className='text-danger'
                    color='danger'
                  >
                    <form action={Logout}>
                      <button type='submit'>로그아웃</button>
                    </form>
                  </ListboxItem>
                </Listbox>
              </PopoverContent>
            </Popover>
          ) : (
            <Link
              href={{
                pathname: '/login',
                query: { callbackurl: pathname },
              }}
            >
              <Button variant='light' type='submit'>
                로그인/가입
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
