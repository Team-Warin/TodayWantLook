import type { MediaData } from '@/types/media';

import style from '@/styles/Login.module.css';

import Link from 'next/link';
import Image from 'next/image';

import { signIn } from '@/auth';
import { providerMap } from '@/auth.config';

import { Button } from '@nextui-org/button';

import { connectDB } from '@/modules/database';
import division from '@/modules/division';
import Card from '@/components/Card';

export default async function Login({
  searchParams,
}: {
  searchParams: { callbackurl?: string };
}) {
  const color: { [key: string]: string } = {
    google: 'bg-google',
  };

  const db = (await connectDB).db(process.env.DB_NAME);
  const media = await db
    .collection<MediaData[]>('media')
    .aggregate([{ $sample: { size: 40 } }])
    .toArray();

  const bgMediaList = division(media, 10) as MediaData[][];

  return (
    <div className={style.container}>
      <div className={style.bgContainer}>
        {bgMediaList.map((mediaList: MediaData[], i: number) => {
          return (
            <div key={i} className={style.bgCard}>
              {[...Array(2).keys()].map((i: number) => {
                return (
                  <div key={i} className={style.cardSlider}>
                    {mediaList.map((media: MediaData, i: number) => {
                      return (
                        <Card
                          isLoading={false}
                          data={media}
                          info={false}
                          lazy={false}
                          size={5}
                          key={i}
                        ></Card>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          );
        })}
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
