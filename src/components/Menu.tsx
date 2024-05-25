'use client';

import type { Session } from 'next-auth';

import { WAGURI } from '@/modules/font';

import style from '@/styles/Menu.module.css';

import Link from 'next/link';
import Logout from '@/action/logout';

import { useState } from 'react';

import { Avatar } from '@nextui-org/avatar';
import { Button } from '@nextui-org/button';
import { Listbox, ListboxItem } from '@nextui-org/listbox';

export default function Menu({
  session,
  menu,
  pathname,
}: {
  session: Session | null;
  menu: { name: string; url: string; disblePage?: string[] }[];
  pathname: string | null;
}) {
  let [active, setActive] = useState<boolean>(false);

  return (
    <>
      <div
        className={`${style.menuBtn} ${active ? style.active : ''}`}
        onClick={() => setActive(!active)}
      >
        <div></div>
        <div></div>
        <div></div>
      </div>

      <div className={`${style.menuContainer} ${active ? style.active : ''}`}>
        {/* MyInfo */}
        <div>
          <div className={style.barContainer}>
            <hr />
            <h1>내 정보</h1>
          </div>
          {session ? (
            <div className={style.SessionContainer}>
              <Avatar
                radius='md'
                size='lg'
                className='cursor-pointer'
                src={session.user.image!}
              />
              <p className={WAGURI.className}>{session.user.nickname}</p>
            </div>
          ) : (
            <div className={style.noSessionContainer}>
              <Link
                href={{
                  pathname: '/login',
                  query: { callbackurl: pathname ?? '/' },
                }}
              >
                <span className='text-blue-400'>로그인</span> 하기
              </Link>
            </div>
          )}
        </div>

        {/* Menu */}
        <div>
          <div className={style.barContainer}>
            <hr />
            <h1>메뉴</h1>
          </div>
          <Listbox aria-labelledby='' aria-label='Menu'>
            {menu.map((item, i) => {
              return (
                <ListboxItem key={i}>
                  <Link
                    className={`${pathname === item.url ? 'text-twl' : ''}`}
                    href={item.url}
                  >
                    {item.name}
                  </Link>
                </ListboxItem>
              );
            })}
          </Listbox>
        </div>

        {/* LogOut Text */}
        {session ? (
          <form className={style.logout} action={Logout}>
            <Button type='submit' size='sm' variant='light' color='danger'>
              로그아웃
            </Button>
          </form>
        ) : null}
      </div>
    </>
  );
}
