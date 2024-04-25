import type { MediaData } from '@/types/media';

import style from '@/styles/Card.module.css';

import Image from 'next/image';

import { Skeleton } from '@nextui-org/skeleton';
import { ForwardedRef, forwardRef, lazy } from 'react';

interface CardProps {
  isLoading: boolean;
  data: MediaData | number;
  info?: boolean;
  quality?: number;
  lazy?: boolean;
}

/**
 * Card UI Component
 */
function Card(
  { isLoading, data, info, quality, lazy }: CardProps,
  ref: ForwardedRef<HTMLDivElement>
) {
  if (isLoading && typeof data === 'number') {
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
          {data.img ? (
            <Image
              className={style.poster}
              width={450}
              height={380}
              quality={quality ?? 75}
              src={data.img}
              loading={lazy === false ? 'eager' : 'lazy'}
              placeholder='blur'
              blurDataURL='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAFklEQVR42mN8//HLfwYiAOOoQvoqBABbWyZJf74GZgAAAABJRU5ErkJggg=='
              alt={'poster'}
            ></Image>
          ) : null}
          {data.backdrop_img ? (
            <Image
              className='absolute z-0'
              src={data.backdrop_img}
              fill={true}
              sizes='(max-width: 149px), (max-width: 258px)'
              quality={quality ?? data.img ? 50 : 75}
              loading={lazy === false ? 'eager' : 'lazy'}
              placeholder='blur'
              blurDataURL='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAFklEQVR42mN8//HLfwYiAOOoQvoqBABbWyZJf74GZgAAAABJRU5ErkJggg=='
              alt={'posterBg'}
            ></Image>
          ) : data.img ? (
            <Image
              className='absolute z-0 blur-md'
              src={data.img}
              width={450}
              height={380}
              quality={quality ?? 75}
              loading={lazy === false ? 'eager' : 'lazy'}
              placeholder='blur'
              blurDataURL='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAFklEQVR42mN8//HLfwYiAOOoQvoqBABbWyZJf74GZgAAAABJRU5ErkJggg=='
              alt={'posterBg'}
            ></Image>
          ) : null}
        </div>
        {info !== false ? (
          <div className={style.poster_title}>
            <p>{data.title}</p>
            <div>
              <div className={style.author}>
                <span>{data.author}</span>{' '}
              </div>
              <span className={style.rate}>★ {data.rate}</span>
            </div>
          </div>
        ) : null}
      </div>
    );
  }
}

export default forwardRef(Card);
