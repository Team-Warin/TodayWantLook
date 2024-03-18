'use client';

import type { MediaData } from '@/types/media';
import type { Dispatch, ForwardedRef, RefObject, SetStateAction } from 'react';

import style from '@/styles/Like.module.css';
import cardStyle from '@/styles/ui/Card.module.css';

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
    if (card && windowWidth > 1) {
      const cardWidth: number = card.current?.clientWidth ?? 149;
      let rows = 0;

      if ((windowWidth - 24) % (cardWidth + 16) >= cardWidth) {
        rows = Math.floor((windowWidth - 24) / (cardWidth + 16)) + 1;
      } else {
        rows = Math.floor((windowWidth - 24) / (cardWidth + 16));
      }

      setRow(rows);
      setItmes(rows * 3);
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
              if (data.length % row === 0) {
                return null;
              }
              return <div key={i} className={`w-[149px] h-[298px]`}></div>;
            })
          : null}
        {data ? null : (
          <div className={`${cardStyle.container} h-4`} ref={card}></div> //더미 카드 초반 카드 width를 알기위함
        )}
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
