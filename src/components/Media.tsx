'use client';

import type { MediaData, FilterType } from '@/types/media';
import type { Dispatch, SetStateAction } from 'react';

import style from '@/styles/Media.module.css';
import cardStyle from '@/styles/Card.module.css';

import axios from 'axios';
import useSWRMutation from 'swr/mutation';
import { useEffect, useState, useRef } from 'react';
import useDidMountEffect from './hooks/useDidMountEffect';

import Filter from './Filter';

export default function Media({
  max,
  like,
  setLike,
}: {
  max?: number;
  like?: MediaData[];
  setLike?: Dispatch<SetStateAction<MediaData[]>>;
}) {
  let controller: AbortController; //api abort controller

  const card = useRef<HTMLDivElement>(null);

  let [row, setRow] = useState<number>(0);
  let [page, setPage] = useState<number>(0);

  const [mediaData, setMediaData] = useState<MediaData[]>([]);
  const [filter, setFilter] = useState<FilterType>({
    title: '',
    genre: [],
    type: [],
    updateDays: [],
  });

  async function mediaFetch(
    url: string,
    { arg }: { arg: { filter: FilterType; page: [number, number] } }
  ) {
    controller = new AbortController();
    const signal = controller.signal;

    return await axios.post(url, arg, { signal }).then((res) => res.data);
  }

  const { trigger, data, isMutating } = useSWRMutation(
    '/api/media',
    mediaFetch
  );

  useEffect(() => {
    const Row = () => {
      if (card.current) {
        const cardWidth: number = (card.current.clientWidth ?? 149) + 16;
        const containerWidth: number = window.innerHeight - 24;
        let rows = 0;

        if (containerWidth % (cardWidth + 16) >= cardWidth) {
          rows = Math.floor(containerWidth / cardWidth) + 1;
        } else {
          rows = Math.floor(containerWidth / cardWidth);
        }

        setRow(rows);
      }
    };

    window.addEventListener('resize', Row);

    return () => {
      window.removeEventListener('resize', Row);
    };
  }, []);

  useDidMountEffect(() => {
    if (mediaData.length < (page + 1) * row * 4) {
      trigger({
        filter: filter,
        page: [mediaData.length, (page + 1) * row * 4],
      });
    }
  }, [row]);

  return (
    <div className={style.container}>
      {row === 0 ? (
        <div className={cardStyle.container} ref={card}></div> // 데이터 불러오기전 card의 width를 알기 위한 dummy
      ) : null}
      <Filter filter={filter} setFilter={setFilter} />

      {/* 작품 콘테이너 */}
      <div className={style.mediaContainer}></div>
    </div>
  );
}
