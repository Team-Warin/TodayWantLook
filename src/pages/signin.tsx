import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from 'next';

import style from '@/styles/Signin.module.css';

import Image from 'next/image';

import { Button } from '@nextui-org/button';

import { getProviders, signIn } from 'next-auth/react';
import { getServerSession } from 'next-auth/next';
import { authOptions } from './api/auth/[...nextauth]';

/**
 * /sign 페이지
 */
export default function SignIn({
  providers,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const color: { [key: string]: { style: string; icon: string } } = {
    Google: {
      style: style.google,
      icon: 'https://img.icons8.com/?size=512&id=17949&format=png',
    },
  };

  return (
    <div
      className={`flex justify-items-center items-center w-full h-[100vh] ${style.container}`}
    >
      <div
        className={`${style.login_container} flex p-10 w-full h-full rounded-3xl shadow-lg`}
      >
        <div className='w-full h-full'>
          <Image
            width={80}
            height={80}
            placeholder='blur'
            blurDataURL='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAFklEQVR42mN8//HLfwYiAOOoQvoqBABbWyZJf74GZgAAAABJRU5ErkJggg=='
            src={'/Logo.svg'}
            alt='logo'
          ></Image>
          <p className='mt-2'>로그인</p>
        </div>
        <div className='w-full h-full p-5 ps-14'>
          {Object.values(providers).map((provider, i: number) => {
            return (
              <Button
                className={`${color[provider.name].style} ${style.btn}`}
                onClick={() => signIn(provider.id)}
                key={i}
              >
                <Image
                  src={color[provider.name].icon}
                  width={40}
                  height={40}
                  placeholder='blur'
                  blurDataURL='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAFklEQVR42mN8//HLfwYiAOOoQvoqBABbWyZJf74GZgAAAABJRU5ErkJggg=='
                  alt={provider.name}
                ></Image>
                <p>
                  <span className='font-semibold'>
                    {provider.name}로 로그인 하기
                  </span>
                </p>
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (session) {
    return { redirect: { destination: '/' } };
  }

  const providers = await getProviders();

  return {
    props: { providers: providers ?? [] },
  };
}
