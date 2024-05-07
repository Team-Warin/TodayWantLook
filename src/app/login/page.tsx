import style from '@/styles/Login.module.css';

import dynamic from 'next/dynamic';

import Link from 'next/link';
import Image from 'next/image';

import { signIn } from '@/auth';
import { providerMap } from '@/auth.config';

import { Button } from '@nextui-org/button';

import { CreateClient } from '@/modules/supabase';

import division from '@/modules/division';
import Card from '@/components/Card';

const LoginBG = dynamic(() => import('@/components/LoginBG'));

export default async function Login({
  searchParams,
}: {
  searchParams: { callbackurl?: string };
}) {
  const color: { [key: string]: string } = {
    google: 'bg-google',
  };

  const supabse = CreateClient();
  const { data: media } = await supabse
    .schema('todaywantlook')
    .rpc('get_random_medias', { length: 24 });

  const bgMediaList = division(media!, media!.length / 4);

  return (
    <div className={style.container}>
      <div className={style.bgContainer}>
        <LoginBG bgMediaList={bgMediaList} />
      </div>
      <div className={style.overlay}>
        <div className={style.loginMenu}>
          <Link href='/'>
            <Image src='/Logo.webp' width={90} height={90} alt='logo' />
          </Link>
          <p className={style.loginDesc}>모든 온라인 미디어를 한-번에 추천!</p>

          {Object.values(providerMap).map((provider, i) => {
            return (
              <form
                key={i}
                action={async () => {
                  'use server';
                  await signIn(provider.id, {
                    redirectTo: searchParams.callbackurl ?? '/',
                  });
                }}
                className='w-full'
              >
                <Button
                  type='submit'
                  className={`w-full rounded-md shadow-md ${color[provider.id]}`}
                >
                  <Image
                    src={`https://authjs.dev/img/providers/${provider.id}.svg`}
                    width={25}
                    height={25}
                    alt='provider'
                  ></Image>
                  <p>{provider.name}로 시작하기</p>
                </Button>
              </form>
            );
          })}
        </div>
      </div>
    </div>
  );
}
