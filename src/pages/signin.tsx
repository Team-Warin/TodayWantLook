import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from 'next';

import style from '@/styles/Signin.module.css';

import Image from 'next/image';

import { getProviders, signIn } from 'next-auth/react';
import { getServerSession } from 'next-auth/next';
import { authOptions } from './api/auth/[...nextauth]';

import { BMJUA } from '@/modules/font';

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
          <h1 className={BMJUA.className}>TodayWantLook</h1>
          <p>로그인</p>
        </div>
        <div className='w-full h-full p-5 ps-14'>
          {Object.values(providers).map((provider, i: number) => {
            return (
              <button
                className={`${color[provider.name].style} ${
                  style.btn
                } flex justify-center items-center gap-2 w-full p-3 pt-5 pb-5 shadow-md rounded-xl`}
                onClick={() => signIn(provider.id)}
                key={i}
              >
                <Image
                  src={color[provider.name].icon}
                  width={40}
                  height={40}
                  alt={provider.name}
                ></Image>
                <p>
                  <span className='font-semibold'>
                    {provider.name}로 로그인 하기
                  </span>
                </p>
              </button>
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
