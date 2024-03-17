'use client';

import type { MediaData } from '@/types/media';
import type { Dispatch, ForwardedRef, RefObject, SetStateAction } from 'react';

import style from '@/styles/Like.module.css';

import useSWR from 'swr';

import Card from '@/components/ui/Card';
import { useState, useEffect, useRef, forwardRef } from 'react';

interface LikeMediaProps {
  isLoading: boolean;
  data: MediaData | number;
  likes: MediaData[];
  setLikes: Dispatch<SetStateAction<MediaData[]>>;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Like() {
  const { data, error, isLoading } = useSWR('/api/media', fetcher);

  const container = useRef<HTMLDivElement>(null);
  const card = useRef<HTMLDivElement>(null);

  let [likes, setLikes] = useState<MediaData[]>([]);
  let [row, setRow] = useState(0);
  let [items, setItmes] = useState(0);

  useEffect(() => {
    if (card && container) {
      const containerWidth: number = (container.current?.clientWidth ?? 1) - 24;
      const cardWidth: number = container.current?.clientWidth ?? 1;

      setRow(Math.floor((containerWidth / cardWidth) * 10));
      setItmes(Math.floor((containerWidth / cardWidth) * 10) * 3);
    }
  }, []);

  function Observer() {
    setItmes((items += row * 2));
  }

  useEffect(() => {
    if (row) {
      const observer = new IntersectionObserver(Observer, {
        threshold: 0,
      });

      const observerTarget = document.getElementById('observer');

      if (observerTarget) {
        observer.observe(observerTarget);
      }
    }
  }, [row]);

  return (
    <div className='w-full mt-5 p-3'>
      <div
        className='w-full flex justify-between flex-wrap gap-4'
        ref={container}
      >
        {(data ?? [...Array(30).keys()])
          .slice(0, items)
          .map((data: MediaData | number, i: number) => {
            return (
              <LikeMedia
                key={i}
                isLoading={isLoading}
                data={data}
                likes={likes}
                setLikes={setLikes}
                ref={card}
              ></LikeMedia>
            );
          })}
        <div id='observer' className='w-full h-3'></div>
      </div>
    </div>
  );
}

const LikeMedia = forwardRef(
  (
    { isLoading, data, likes, setLikes }: LikeMediaProps,
    ref: ForwardedRef<HTMLDivElement>
  ) => {
    let [checked, setChecked] = useState(false);

    if (isLoading) {
      return <Card isLoading={isLoading} data={data} ref={ref}></Card>;
    }
    return (
      <div
        ref={ref}
        className={`${style.checkbox} ${checked ? style.checked : ''}`}
        onClick={() => {
          let temp = [...likes];

          if (typeof data !== 'number') {
            if (checked) {
              temp = temp.filter((e: MediaData) => {
                console.log(e.mediaId !== data.mediaId);
              });
            } else if (data) {
              temp.push(data);
            }
          }

          setLikes(temp);
          setChecked(!checked);
        }}
      >
        <Card isLoading={isLoading} data={data}></Card>
      </div>
    );

    LikeMedia.displayName = 'LikeMedia';
  }
);
