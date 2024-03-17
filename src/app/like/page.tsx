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

  const card = useRef<HTMLDivElement>(null);

  let [likes, setLikes] = useState<MediaData[]>([]);
  let [windowWidth, setWindowWidth] = useState(0);
  let [row, setRow] = useState(0);
  let [items, setItmes] = useState(0);

  function Observer() {
    setItmes((items += row * 2));
  }

  useEffect(() => {
    setWindowWidth(window.innerWidth);
  }, []);

  useEffect(() => {
    window.addEventListener('resize', () => setWindowWidth(window.innerWidth));

    return () => {
      window.removeEventListener('resize', () =>
        setWindowWidth(window.innerWidth)
      );
    };
  }, [windowWidth]);

  useEffect(() => {
    if (card) {
      const containerWidth: number = windowWidth - 24;
      const cardWidth: number = card.current?.clientWidth ?? 149;

      setRow(Math.floor(containerWidth / cardWidth));
      setItmes(Math.floor(containerWidth / cardWidth) * 3);
    }
  }, [windowWidth]);

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
      <div className='w-full flex justify-between flex-wrap gap-4'>
        {(data ?? [...Array(30).keys()])
          .slice(0, items)
          .map((media: MediaData | number, i: number) => {
            return (
              <LikeMedia
                key={i}
                isLoading={isLoading}
                data={media}
                likes={likes}
                setLikes={setLikes}
                ref={card}
              ></LikeMedia>
            );
          })}
        {data
          ? [...Array(row - (data.length % row)).keys()].map((_, i: number) => {
              return <div key={i} className={`w-[149px] h-[298px]`}></div>;
            })
          : null}
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
