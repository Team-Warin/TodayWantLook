import type { MediaData } from '@/types/media';

import style from '@/styles/Main.module.css';

import dynamic from 'next/dynamic';

import Intro from '@/components/Intro';

import { CreateClient } from '@/modules/supabase';
import { auth } from '@/auth';

const Scroll = dynamic(() => import('@/components/Scroll'));

/**
 * / 페이지
 */
export default async function Home() {
  const supabase = CreateClient();

  const session = await auth();

  const { data: medias } = await supabase
    .schema('todaywantlook')
    .rpc('get_medias', {
      _title: '',
      _genre: '',
      _additional: '{}',
      _type: '',
      _update: '',
    })
    .order('rate', { ascending: false, nullsFirst: false })
    .order('title')
    .range(0, 9);

  return (
    <main className='bg-white'>
      <Intro medias={medias!} />
      <div className={style.container}>
        {session ? (
          <Scroll
            title={
              <div className={style.title}>
                <p>당신을 위한 추천</p>
              </div>
            }
            userId={session.user.id}
          />
        ) : null}
      </div>
    </main>
  );
}
