'use client';

import type { CardCSS } from '@/types/react';
import type { MediaData, FilterType } from '@/types/media';
import type { Dispatch, SetStateAction } from 'react';

import style from '@/styles/Media.module.css';
import cardStyle from '@/styles/Card.module.css';

import { useSession } from 'next-auth/react';

import axios, { CanceledError } from 'axios';
import useSWRMutation from 'swr/mutation';

import { useEffect, useState, useRef } from 'react';
import { useInView } from 'react-intersection-observer';
import useDidMountEffect from './hooks/useDidMountEffect';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';

import Filter from './Filter';
import Card from './Card';

export default function Media({
  max,
  like,
  setLike,
}: {
  max?: number;
  like?: MediaData[];
  setLike?: Dispatch<SetStateAction<MediaData[]>>;
}) {
  let [controller, setController] = useState<AbortController>(); //api abort controller

  const session = useSession();

  const card = useRef<HTMLDivElement>(null);

  let [row, setRow] = useState<number>(0);
  let [page, setPage] = useState<number>(0);

  const [mediaData, setMediaData] = useState<MediaData[]>([]); //작품 데이터
  let [mediaCount, setMediaCount] = useState<number>(0); //작품 데이터 갯수
  const [filter, setFilter] = useState<FilterType>({
    title: '',
    genre: [],
    type: [],
    updateDays: [],
  });

  const { ref, inView } = useInView({
    threshold: 1.0,
  });

  async function mediaFetch(
    url: string,
    {
      arg,
    }: {
      arg: { filter: FilterType; page: [number, number] };
    }
  ) {
    const temp = new AbortController();
    setController(temp);

    const signal = temp.signal;

    return await axios
      .post(url, arg, { signal })
      .then((res) => res.data)
      .catch((e) => {
        if (!(e instanceof CanceledError)) console.log(e);
      });
  }

  const { trigger, data, isMutating } = useSWRMutation(
    '/api/media',
    mediaFetch
  );

  useEffect(() => {
    const Row = () => {
      if (card.current) {
        const cardWidth: number = card.current.clientWidth ?? 149;
        const containerWidth: number = window.innerWidth - 24;
        let rows = 0;

        if (containerWidth % (cardWidth + 16) >= cardWidth) {
          rows = Math.floor(containerWidth / (cardWidth + 16)) + 1;
        } else {
          rows = Math.floor(containerWidth / (cardWidth + 16));
        }

        setRow(rows);
      }
    };

    Row();
    window.addEventListener('resize', Row);

    return () => {
      window.removeEventListener('resize', Row);
    };
  }, []);

  useDidMountEffect(() => {
    if (mediaData.length < mediaCount || mediaCount === 0) {
      trigger({
        filter: filter,
        page: [mediaData.length, (page + 1) * row * 4],
      });
    }
  }, [row, page]);

  useDidMountEffect(() => {
    if (data) {
      setMediaCount(data.mediaCount);
      setMediaData([...mediaData, ...data.mediaData]);
    }
  }, [data]);

  useDidMountEffect(() => {
    if (controller) controller.abort();
    Promise.all([
      setPage(0),
      setMediaData([]),
      trigger({
        filter: filter,
        page: [mediaData.length, (page + 1) * row * 4],
      }),
    ]);
  }, [filter]);

  useDidMountEffect(() => {
    if (inView) {
      setPage((page += 1));
    }
  }, [inView]);

  return (
    <div className={style.container}>
      <div
        className={cardStyle.container}
        style={{ '--size': '0%' } as CardCSS}
        ref={card}
      ></div>
      <Filter filter={filter} setFilter={setFilter} />
      {/* 작품 콘테이너 */}
      <div className={`${style.mediaContainer} mt-5`}>
        {(isMutating
          ? [
              ...mediaData,
              ...Array(
                row === 0
                  ? 30
                  : (page + 1) * row * 4 - mediaData.length < 0
                    ? 0
                    : (page + 1) * row * 4 - mediaData.length
              ).keys(),
            ]
          : mediaData
        )
          .slice(0, (page + 1) * row * 4)
          .map((media: MediaData | number, i: number) => {
            if (like && setLike && max) {
              const checked =
                typeof media !== 'number' ? like.includes(media) : false;

              return (
                <div
                  key={i}
                  className={`${style.checkbox} ${checked ? style.checked : null}`}
                  onClick={() => {
                    if (typeof media === 'number') return;

                    let temp = [...like];

                    if (temp.includes(media)) {
                      temp = temp.filter((e) => e.mediaId !== media.mediaId);
                    } else if (like.length < max) {
                      temp.push(media);
                    }

                    setLike(temp);
                  }}
                >
                  <div>
                    <FontAwesomeIcon icon={faCheck} />
                  </div>
                  <Card isLoading={isMutating} data={media} />
                </div>
              );
            }

            return (
              <div key={i} ref={card}>
                <Card isLoading={isMutating} data={media} />
              </div>
            );
          })}
        {mediaData && row
          ? [...Array(Math.floor(row - (mediaData.length % row))).keys()].map(
              (_, i: number) => {
                if (mediaData.length % row === 0) {
                  return null;
                }
                return (
                  <div
                    key={i}
                    className={cardStyle.container}
                    style={{ '--size': '0%' } as CardCSS}
                  ></div>
                );
              }
            )
          : null}
      </div>
      {(page + 1) * row * 4 >= mediaCount || isMutating ? null : (
        <div id='observer' ref={ref}></div>
      )}
    </div>
  );
}
