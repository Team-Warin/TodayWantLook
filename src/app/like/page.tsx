'use client';

import type { MediaData, FilterType } from '@/types/media';
import type { Dispatch, ForwardedRef, SetStateAction } from 'react';

import axios from 'axios';

import style from '@/styles/Like.module.css';
import cardStyle from '@/styles/ui/Card.module.css';

import useSWRMutation from 'swr/mutation';

import Card from '@/components/ui/Card';
import { useState, useEffect, useRef, forwardRef } from 'react';
import Filter from '@/components/ui/Filter';

interface LikeMediaProps {
  isLoading: boolean;
  data: MediaData | number;
  likes: MediaData[];
  setLikes: Dispatch<SetStateAction<MediaData[]>>;
}

async function refetch(url: string, { arg }: { arg: FilterType }) {
  return await axios.post(url, arg).then((res) => res.data);
}

export default function Like() {
  const [filter, setFilter] = useState<FilterType>({
    title: null,
    genre: [],
    type: [],
  });

  const card = useRef<HTMLDivElement>(null);

  const { trigger, data, isMutating } = useSWRMutation('/api/media', refetch);

  let [likes, setLikes] = useState<MediaData[]>([]);
  let [windowWidth, setWindowWidth] = useState(0);
  let [row, setRow] = useState(0);
  let [items, setItmes] = useState(0);

  function Observer() {
    setItmes((items += row * 2));
  }

  useEffect(() => {
    trigger(filter);
  }, [filter]);

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
      <Filter filter={filter} setFilter={setFilter} />
      <div className='w-full flex justify-between flex-wrap gap-4'>
        {data ? data.length < 1 ? <div>작품이 없어요.</div> : null : null}
        {(data ?? [...Array(30).keys()])
          .slice(0, items)
          .map((media: MediaData | number, i: number) => {
            return (
              <LikeMedia
                key={i}
                isLoading={isMutating}
                data={media}
                likes={likes}
                setLikes={setLikes}
                ref={card}
              ></LikeMedia>
            );
          })}
        {data && row
          ? [...Array(Math.floor(row - (data.length % row))).keys()].map(
              (_, i: number) => {
                if (data.length % row === 0) {
                  return null;
                }
                return <div key={i} className={`w-[149px] h-[298px]`}></div>;
              }
            )
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
                return e.mediaId !== data.mediaId;
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
