import style from '@/styles/MediaPage.module.css';

import { BMJUA, WAGURI } from '@/modules/font';
import { CreateClient, CreateServerClient } from '@/modules/supabase';

import { redirect } from 'next/navigation';
import { revalidateTag } from 'next/cache';

import { auth } from '@/auth';
import Loading from './loading';

import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';

import { getKeys } from '@/modules/getKeys';

import Card from '@/components/Card';
import Summary from '@/components/Summary';

import { Chip } from '@nextui-org/chip';
import { Code } from '@nextui-org/code';
import { Tooltip } from '@nextui-org/tooltip';
import { Button } from '@nextui-org/button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { faStar } from '@fortawesome/free-solid-svg-icons';
import { faHeart as dontLike } from '@fortawesome/free-regular-svg-icons/faHeart';
import { faHeart as isLike } from '@fortawesome/free-solid-svg-icons/faHeart';

const YouTubeResult = dynamic(() => import('@/components/YouTubeResult'));

export default async function Media({ params }: { params: { id: string } }) {
  const supabase = await CreateClient();
  const session = await auth();

  const { data: media } = await supabase
    .schema('todaywantlook')
    .from('medias')
    .select('*')
    .match({ mediaId: params.id })
    .single();

  async function setLike() {
    'use server';

    const supabase = await CreateServerClient();

    let { data: rate } = await supabase
      .schema('next_auth')
      .from('users_ratings')
      .select('*')
      .match({ mediaId: params.id, userId: session?.user.id })
      .single();

    if (rate === null) {
      return await supabase.schema('next_auth').from('users_ratings').insert({
        userId: session?.user.id!,
        mediaId: params.id,
        genre: media?.genre!,
      });
    }

    rate.checks.like = !rate.checks.like;

    await supabase.schema('next_auth').from('users_ratings').upsert(rate);

    revalidateTag('media');
  }

  const { data: rate } = await supabase
    .schema('next_auth')
    .from('users_ratings')
    .select('*')
    .match({
      mediaId: media?.mediaId!,
      userId: session?.user.id,
    })
    .single();

  const additional = getKeys(media?.additional!).reduce(
    (arr: string[], cur) => {
      if (media?.additional![cur] === true && cur !== 'up') {
        arr.push(cur);
      }
      return arr;
    },
    [...media?.additional?.singularityList!].concat(
      media?.updateDays?.includes('finished') ? ['finished'] : []
    )
  );

  const tooltip: {
    [key: string]: {
      text: string;
      color:
        | 'danger'
        | 'default'
        | 'foreground'
        | 'primary'
        | 'secondary'
        | 'success'
        | 'warning';
    };
  } = {
    over15: { text: '15세', color: 'warning' },
    adult: { text: '청소년 시청 불가', color: 'danger' },
    free: { text: '연재 무료', color: 'success' },
    waitFree: { text: '기다리면 무료', color: 'success' },
    new: { text: '신작', color: 'success' },
    rest: { text: '휴재', color: 'default' },
    finished: { text: '완결', color: 'default' },
  };

  // return <Loading />; Loading UI Testing

  return (
    <div className={style.container}>
      <div className={style.mediaCardContainer}>
        <div className={style.mediaInfoContainer}>
          <div className={style.mediaCard}>
            <Link rel='preconnect' href={media?.url!}>
              <Card data={media!} info={false} isUrl={true} />
            </Link>
            <div className={`${style.mediaTitle} ${WAGURI.className}`}>
              <div className='flex items-center gap-3'>
                <Chip color='warning' variant='flat' radius='sm'>
                  <FontAwesomeIcon icon={faStar} /> {media?.rate!}
                </Chip>
                <h1>{media?.title!}</h1>
                {session ? (
                  <Tooltip color='danger' content='좋아요'>
                    <form action={setLike}>
                      <Button
                        className='text-2xl'
                        isIconOnly
                        variant='light'
                        color='danger'
                        size='lg'
                        type='submit'
                      >
                        <FontAwesomeIcon
                          icon={rate?.checks.like === true ? isLike : dontLike}
                        />
                      </Button>
                    </form>
                  </Tooltip>
                ) : null}
              </div>
              <p>{media?.author!}</p>

              <div className={`${BMJUA.className} ${style.mediaGenre}`}>
                {media?.genre.map((genre, i) => {
                  return (
                    <Chip key={i} radius='sm'>
                      {genre}
                    </Chip>
                  );
                })}
              </div>
              <Summary summary={media?.summary!} />
            </div>
          </div>
          <div className={style.mediaAdditional}>
            {additional.map((badge, i) => {
              return (
                <Tooltip
                  key={i}
                  showArrow
                  content={tooltip[badge].text}
                  color={tooltip[badge].color}
                >
                  <Image
                    width={25}
                    height={25}
                    src={`/icon/${badge}.webp`}
                    alt={tooltip[badge].text}
                  />
                </Tooltip>
              );
            })}
          </div>
        </div>

        <div className={style.barContainer}>
          <hr />
          <h1>평가</h1>
        </div>

        {/* WebToon Video */}
        <h1
          className={style.mediaYouTubeTitle}
        >{`"${media?.title!}" 관련 영상${media?.youtube.length! < 1 ? '을 유튜브에서 찾을 수 없었습니다.' : '!'}`}</h1>
        {media?.youtube.length! >= 1 ? (
          <Code color='warning'>
            [!] 오래된 작품이나 최신 작품은 다른 영상이 뜰 수 있습니다.
          </Code>
        ) : null}
        <YouTubeResult urls={media?.youtube!} />
      </div>
    </div>
  );
}
