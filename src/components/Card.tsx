import type { CardCSS } from '@/types/react';
import type { MediaData } from '@/types/media';

import style from '@/styles/Card.module.css';

import Image from 'next/image';

import { Skeleton } from '@nextui-org/skeleton';
import { ForwardedRef, forwardRef } from 'react';

import { getKeys } from '@/modules/getKeys';

interface CardProps {
  isLoading?: boolean;
  data: MediaData | number;
  info?: boolean;
  quality?: number;
  lazy?: boolean;
  size?: number;
}

/**
 * Card UI Component
 */
function Card(
  { isLoading = true, data, info, quality, lazy, size }: CardProps,
  ref: ForwardedRef<HTMLDivElement>
) {
  if (isLoading && typeof data === 'number') {
    return (
      <div
        style={{ '--size': size ? `${size}vw` : '0vw' } as CardCSS}
        ref={ref}
      >
        <div className={style.container}>
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
      </div>
    );
  } else if (typeof data !== 'number') {
    const additional = getKeys(data?.additional!).reduce(
      (arr: string[], cur) => {
        if (data?.additional![cur] === true && cur !== 'up') {
          arr.push(cur);
        }
        return arr;
      },
      [...data?.additional?.singularityList!].concat(
        data.updateDays?.includes('finished') ? ['finished'] : []
      )
    );

    return (
      <div
        style={{ '--size': size ? `${size}vw` : '0vw' } as CardCSS}
        ref={ref}
      >
        <div className={style.container}>
          <div className={style.poster_container}>
            {info !== false ? (
              <div className={style.additional}>
                {additional.map((add, i) => {
                  return (
                    <Image
                      key={i}
                      width={20}
                      height={20}
                      src={`/icon/${add}.webp`}
                      alt={add}
                    />
                  );
                })}
              </div>
            ) : null}
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
            {data.backdropImg || (!data.backdropImg && data.img) ? (
              <Image
                className={`absolute z-0 ${!data.backdropImg && data.img ? 'blur-md' : null}`}
                src={data.backdropImg ?? data.img!}
                fill={true}
                sizes='(max-width: auto) 100%, (max-width: auto) 100%'
                quality={quality ?? data.img ? 50 : 75}
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
      </div>
    );
  }
}

export default forwardRef(Card);
