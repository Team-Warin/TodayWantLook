import style from '@/styles/MediaPage.module.css';

import { WAGURI } from '@/modules/font';
import { CreateClient } from '@/modules/supabase';

import Link from 'next/link';
import Image from 'next/image';

import Card from '@/components/Card';
import { Chip } from '@nextui-org/chip';
import { getKeys } from '@/modules/getKeys';
import { Tooltip } from '@nextui-org/tooltip';

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
  };

  return (
    <div className={style.container}>
      <div className={style.mediaContainer}>
        <div>
          <Link href={media?.url!}>
            <Card data={media!} info={false} />
          </Link>
        </div>
        <div className={style.mediaInfo}>
          <div className={style.mediaIntroContainer}>
            <h1 className={`${style.mediaTitle} ${WAGURI.className}`}>
              {media?.title}
            </h1>
            <div className={style.mediaAdditional}>
              {additional.map((add, i) => {
                return (
                  <Tooltip
                    key={i}
                    showArrow={true}
                    color={tooltip[add].color}
                    content={tooltip[add].text}
                  >
                    <Image
                      width={25}
                      height={25}
                      src={`/svg/${media?.service}/${add}.webp`}
                      alt={add}
                    />
                  </Tooltip>
                );
              })}
            </div>
          </div>
          <p className={style.mediaAuthor}>{media?.author}</p>
          <div className={style.mediaGenre}>
            {media?.genre.map((genre, i) => (
              <Chip color='primary' key={i}>
                #{genre}
              </Chip>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
