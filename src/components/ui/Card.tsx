import type { MediaData } from '@/types/media';

import style from '@/styles/ui/Card.module.css';

import Image from 'next/image';

import { Skeleton } from '@nextui-org/react';
import { ForwardedRef, forwardRef } from 'react';

interface CardProps {
  isLoading: boolean;
  data: MediaData | number;
}

function Card(
  { isLoading, data }: CardProps,
  ref: ForwardedRef<HTMLDivElement>
) {
  if (isLoading) {
    return (
      <div className={style.container} ref={ref}>
        <Skeleton className='rounded-lg'>
          <div className={style.poster_container}></div>
        </Skeleton>
        <div className='mt-2'>
          <Skeleton className='w-full rounded'>
            <div className='h-4 bg-default-200'></div>
          </Skeleton>
          <Skeleton className='mt-1 w-3/5 rounded'>
            <div className='h-3 bg-default-200'></div>
          </Skeleton>
        </div>
      </div>
    );
  } else if (typeof data !== 'number') {
    return (
      <div className={style.container}>
        <div className={style.poster_container}>
          <Image
            className={style.poster}
            width={450}
            height={380}
            src={data.img}
            placeholder='blur'
            blurDataURL='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAFklEQVR42mN8//HLfwYiAOOoQvoqBABbWyZJf74GZgAAAABJRU5ErkJggg=='
            alt={'poster'}
          ></Image>
          {data.backdrop_img ? (
            <Image
              className='absolute z-0'
              src={data.backdrop_img}
              fill={true}
              sizes='(max-width: 149px), (max-width: 258px)'
              placeholder='blur'
              blurDataURL='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAFklEQVR42mN8//HLfwYiAOOoQvoqBABbWyZJf74GZgAAAABJRU5ErkJggg=='
              alt={'posterBg'}
            ></Image>
          ) : null}
        </div>
        <div className={style.poster_title}>
          <p>{data.title}</p>
          <p>{data.author}</p>
        </div>
      </div>
    );
  }
}

export default forwardRef(Card);
