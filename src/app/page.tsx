import type { MediaData } from '@/types/media';

import style from '@/styles/Main.module.css';

import Intro from '@/components/Intro';

import { CreateClient } from '@/modules/supabase';

/**
 * / 페이지
 */
export default async function Home() {
  const supabase = CreateClient();

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
    <main>
      <Intro medias={medias!} />
      <div className={style.container}></div>
    </main>
  );
}
