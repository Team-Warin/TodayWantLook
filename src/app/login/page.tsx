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
    google: style.google,
  };

  const db = (await connectDB).db(process.env.DB_NAME);
  const media = await db
    .collection<MediaData[]>('media')
    .aggregate([{ $sample: { size: 40 } }])
    .toArray();

  const bgMediaList = division(media, 10) as MediaData[][];

  return (
    <div className='w-full h-screen relative overflow-hidden'>
      <div className={`flex flex-col gap-24 absolute ${style.bgContainer}`}>
        {bgMediaList.map((mediaList: MediaData[], i: number) => {
          return (
            <div
              className={`flex flex-nowrap scale-125 ${style.bgCard}`}
              key={i}
            >
              {[...Array(2).keys()].map((i: number) => {
                return (
                  <div key={i} className='flex pe-5 gap-5 max-w-max'>
                    {mediaList.map((media: MediaData, i: number) => {
                      return (
                        <Card
                          isLoading={false}
                          data={media}
                          info={false}
                          lazy={false}
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
      <div className='flex absolute w-full h-full backdrop-brightness-75 justify-center items-center z-10'>
        <div className='w-full flex flex-col justify-center items-center gap-5 bg-white p-10 shadow-md rounded-lg max-w-[400px]'>
          <Link href='/'>
            <Image src='/Logo.webp' width={90} height={90} alt='logo' />
          </Link>
          <p className='text-xl'>모든 온라인 미디어를 한-번에 추천!</p>

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
