import type { MediaData } from '@/types/media';

import style from '@/styles/ui/Card.module.css';

import Image from 'next/image';

import { Skeleton } from '@nextui-org/react';

export default function Card(props: {
  isLoading: boolean;
  data: MediaData | number;
}) {
  if (props.isLoading) {
    return (
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
    );
  } else if (typeof props.data !== 'number') {
    return (
      <div className={style.container}>
        <div className={style.poster_container}>
          <Image
            className={style.poster}
            width={450}
            height={380}
            src={props.data.img}
            placeholder='blur'
            blurDataURL='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAFklEQVR42mN8//HLfwYiAOOoQvoqBABbWyZJf74GZgAAAABJRU5ErkJggg=='
            alt={'poster'}
          ></Image>
          {props.data.backdrop_img ? (
            <Image
              className='absolute z-0'
              src={props.data.backdrop_img}
              fill={true}
              sizes='(max-width: 149px), (max-width: 258px)'
              placeholder='blur'
              blurDataURL='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAFklEQVR42mN8//HLfwYiAOOoQvoqBABbWyZJf74GZgAAAABJRU5ErkJggg=='
              alt={'posterBg'}
            ></Image>
          ) : null}
        </div>
        <div className={style.poster_title}>
          <p>{props.data.title}</p>
          <p>{props.data.author}</p>
        </div>
      </div>
    );
  }
}
