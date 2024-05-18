'use client';

import type { CardCSS } from '@/types/react';
import type { MediaData, FilterType } from '@/types/media';
import type { Dispatch, SetStateAction } from 'react';

import style from '@/styles/Media.module.css';
import cardStyle from '@/styles/Card.module.css';

import axios, { CanceledError } from 'axios';
import useSWRMutation from 'swr/mutation';

import React, { useEffect, useState, useRef } from 'react';
import { useInView } from 'react-intersection-observer';
import useDidMountEffect from './hooks/useDidMountEffect';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';

import Filter from './Filter';
import Card from './Card';
import Link from 'next/link';
import { Button } from '@nextui-org/button';
import { getKeys } from '@/modules/getKeys';

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

  const card = useRef<HTMLDivElement>(null);

  let [row, setRow] = useState<number>(0);
  let [page, setPage] = useState<number>(0);

  const [mediaData, setMediaData] = useState<MediaData[]>([]); //작품 데이터
  let [mediaCount, setMediaCount] = useState<number | null>(null); //작품 데이터 갯수

  let [mediaNull, setMediaNull] = useState<boolean>(false);

  const [filter, setFilter] = useState<FilterType>({
    title: [],
    genre: [],
    additional: [],
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

        if (rows !== row) setRow(rows);
      }
    };

    Row();
    window.addEventListener('resize', Row);

    return () => {
      window.removeEventListener('resize', Row);
    };
  }, [row]);

  useDidMountEffect(() => {
    if (mediaCount) {
      if (mediaData.length >= mediaCount) return;
    }

    if (mediaData.length >= (page + 1) * row * 4) return;

    trigger({
      filter: filter,
      page: [mediaData.length, (page + 1) * row * 4],
    });
  }, [row, page]);

  useDidMountEffect(() => {
    if (controller) controller.abort();

    Promise.all([
      setMediaNull(false),
      setPage(0),
      setMediaData([]),
      trigger({
        filter: filter,
        page: [page === 0 ? page : mediaData.length, (page + 1) * row * 4],
      }),
    ]);
  }, [filter]);

  useDidMountEffect(() => {
    if (data) {
      setMediaCount(data.mediaCount);
      setMediaData([...mediaData, ...data.mediaData]);

      if (mediaData.length < 1 && data.mediaData.length < 1) setMediaNull(true);
    }
  }, [data]);

  useDidMountEffect(() => {
    if (inView && !isMutating) {
      setPage((page += 1));
    }
  }, [inView, isMutating]);

  return (
    <div className={style.container}>
      <div
        className={cardStyle.container}
        style={{ '--size': '0%' } as CardCSS}
        ref={card}
      ></div>
      <Filter isMutating={isMutating} filter={filter} setFilter={setFilter} />
      {/* 작품 콘테이너 */}

      {mediaNull && !isMutating ? (
        <div className={style.mediaNull}>
          <p>
            작품 정보가 없습니다.
            <Button
              size='md'
              color='danger'
              variant='light'
              onClick={() =>
                setFilter(() => {
                  let temp = { ...filter };

                  getKeys(temp).map((key) => (temp[key] = []));
                  return temp;
                })
              }
            >
              필터 초기화
            </Button>
          </p>
        </div>
      ) : null}

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
          .slice(
            0,
            (page + 1) * row * 4 <= mediaCount!
              ? (page + 1) * row * 4
              : mediaCount! + (row - (mediaCount! % row))
          )
          .map((media: MediaData | number, i: number) => {
            if (like && setLike && max) {
              const checked =
                typeof media !== 'number'
                  ? like.some((m) => m.mediaId === media.mediaId)
                  : false;

              return (
                <div
                  key={i}
                  className={`${style.checkbox} ${checked ? style.checked : null}`}
                  onClick={() => {
                    if (typeof media === 'number') return;

                    let temp = [...like];

                    if (temp.some((m) => m.mediaId === media.mediaId)) {
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
              <div key={i}>
                <MediaLink media={media}>
                  <Card isLoading={isMutating} data={media} />
                </MediaLink>
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
      {(page + 1) * row * 4 >= mediaCount! || isMutating ? null : (
        <div id='observer' ref={ref}></div>
      )}
    </div>
  );
}

function MediaLink({
  media,
  children,
}: {
  media: MediaData | number;
  children: React.ReactNode;
}) {
  if (typeof media === 'number') return children;

  return <Link href={`/media/${media.mediaId}`}>{children}</Link>;
}
