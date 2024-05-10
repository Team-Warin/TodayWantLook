import style from '@/styles/MediaPage.module.css';

import { BMJUA, WAGURI } from '@/modules/font';
import { CreateClient } from '@/modules/supabase';

import Image from 'next/image';
import dynamic from 'next/dynamic';

import { getKeys } from '@/modules/getKeys';

import Card from '@/components/Card';
import { Chip } from '@nextui-org/chip';
import { Tooltip } from '@nextui-org/tooltip';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';

const YouTubeResult = dynamic(() => import('@/components/YouTubeResult'));

export default async function Media({ params }: { params: { id: string } }) {
  const supabase = await CreateClient();
  const { data: media } = await supabase
    .schema('todaywantlook')
    .from('medias')
    .select('*')
    .match({ mediaId: params.id })
    .single();

  const additional = getKeys(media?.additional!).reduce(
    (arr: string[], cur) => {
      if (media?.additional![cur] === true && cur !== 'up') {
        arr.push(cur);
      }
      return arr;
    },
    [...media?.additional?.singularityList!]
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
    adult: { text: '청소년 시청 불가', color: 'danger' },
    waitFree: { text: '기다리면 무료', color: 'success' },
    new: { text: '신작', color: 'success' },
    rest: { text: '휴재', color: 'default' },
  };

  return (
    <div className={style.container}>
      <div className={style.mediaCardContainer}>
        <div className={style.mediaInfoContainer}>
          <div className={style.mediaCard}>
            <Card data={media!} info={false} />
            <div className={`${style.mediaTitle} ${WAGURI.className}`}>
              <div className='flex items-center gap-3'>
                <h1>{media?.title!}</h1>
                <Chip radius='sm'>
                  <FontAwesomeIcon icon={faStar} /> {media?.rate!}
                </Chip>
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
                    src={`/icon/${media?.service}/${badge}.webp`}
                    alt={tooltip[badge].text}
                  />
                </Tooltip>
              );
            })}
          </div>
        </div>

        {/* WebToon Video */}
        <h1
          className={style.mediaYouTubeTitle}
        >{`"${media?.title!}" 관련 영상${media?.youtube.length! < 1 ? '을 유튜브에서 찾을 수 없었습니다.' : '!'}`}</h1>
        <YouTubeResult urls={media?.youtube!} />
      </div>
    </div>
  );
}
