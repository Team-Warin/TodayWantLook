'use client';

import type { MediaData, FilterType } from '@/types/media';

import axios from 'axios';
import dynamic from 'next/dynamic';

import style from '@/styles/Like.module.css';
import cardStyle from '@/styles/Card.module.css';

import useSWRMutation from 'swr/mutation';
import { useState, useEffect, useRef } from 'react';
import { useInView } from 'react-intersection-observer';
import useDidMountEffect from '@/components/hooks/useDidMountEffect';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons/faCheck';

import Card from '@/components/Card';
import { Code } from '@nextui-org/react';

const Filter = dynamic(() => import('@/components/Filter'));
const ShowModal = dynamic(() => import('@/components/Modal'));

/**
 * @async
 * @description useSWR API Post Requst Funciton
 * @param {string} url - Api Url
 * @param {{filter: FilterType; page: [number, number]}} arg - API Request Body
 * @returns {MediaData[]} Media Data Return
 */

/**
 * /like 페이지
 */
export default function Like() {
  const max = 10;

  const controller = new AbortController();

  async function mediaFetch(
    url: string,
    { arg }: { arg: { filter: FilterType; page: [number, number] } }
  ) {
    return await axios
      .post(url, arg, { signal: controller.signal })
      .then((res) => res.data)
      .catch((e) => {
        if (!(e instanceof axios.CanceledError)) {
          console.error(e);
        }
      });
  }

  const { ref, inView } = useInView({
    threshold: 1.0,
  });

  const [modal, setModal] = useState<boolean>(true); // 방문 Modal
  const [mediaData, setMediaData] = useState<MediaData[]>([]); // 작품 데이터
  let [mediaCount, setMediaCount] = useState<number>(0); //작품 데이터 갯수
  let [abort, setAbort] = useState<boolean>(false); // 방문 Modal

  let [likes, setLikes] = useState<MediaData[]>([]);

  const [filter, setFilter] = useState<FilterType>({
    title: '',
    genre: [],
    type: [],
    updateDays: [],
  });

  let [page, setPage] = useState<number>(0);
  const [row, setRow] = useState<number>(0);
  const [windowWidth, setWindowWidth] = useState<number>(0);

  const card = useRef<HTMLDivElement>(null);

  const { trigger, data, isMutating } = useSWRMutation(
    '/api/media',
    mediaFetch,
    { revalidate: false }
  );

  useEffect(() => {
    setWindowWidth(window.innerWidth);
  }, []);

  useEffect(() => {
    const WindowResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', WindowResize);

    return () => {
      window.removeEventListener('resize', WindowResize);
    };
  }, [windowWidth]);

  useDidMountEffect(() => {
    if (data) {
      setMediaCount(data.mediaCount);
      setMediaData([...mediaData, ...data.mediaData]); // 데이터 불러온것 State에 추가
    }
  }, [data]);

  useDidMountEffect(() => {
    setMediaData([]);
    setPage(0);
    controller.abort();
    setAbort(controller.signal.aborted);
  }, [filter]);

  useDidMountEffect(() => {
    if (abort) {
      trigger({
        filter: filter,
        page: [mediaData.length, (page + 1) * row * 4],
      }); //Api 요청
      setAbort(false);
    }
  }, [abort]);

  useDidMountEffect(() => {
    if (row && mediaData.length < (page + 1) * row * 4) {
      trigger({
        filter: filter,
        page: [mediaData.length, (page + 1) * row * 4],
      }); //Api 요청
    }
  }, [page, row, filter]);

  useDidMountEffect(() => {
    if (card && windowWidth > 1) {
      const cardWidth: number = card.current?.clientWidth ?? 149;
      let rows = 0;

      if ((windowWidth - 24) % (cardWidth + 16) >= cardWidth) {
        rows = Math.floor((windowWidth - 24) / (cardWidth + 16)) + 1;
      } else {
        rows = Math.floor((windowWidth - 24) / (cardWidth + 16));
      }
      setRow(rows);
    }
  }, [windowWidth]);

  useDidMountEffect(() => {
    if (inView) {
      setPage((page += 1));
    }
  }, [inView]);

  return (
    <div className={style.container}>
      {row === 0 ? (
        <div className={cardStyle.container} ref={card}></div> // 데이터 불러오기전 Card Dummy
      ) : null}
      <ShowModal
        show={modal}
        setShow={setModal}
        modal={{
          title: '좋아하는 작품을 골라주세요~!',
          body: (
            <p>
              좋아하거나 즐겨본 작품을 골라주세요. <br />
              작품을 추천하거나 소개할 알고리즘을 위해 이 데이터가 사용됩니다.
              <br />
              <br />
              <Code color='danger'>
                최소 <span className='font-bold'>1</span>개 최대{' '}
                <span className='font-bold'>{max}</span>개 선택 가능합니다.
              </Code>
            </p>
          ),
          btn: [{ text: '알겠어요', color: 'primary' }],
        }}
      />
      <Filter filter={filter} setFilter={setFilter} />
      <div className={style.mediaContainer}>
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
            return (
              <div
                key={i}
                className={`${style.checkbox} ${
                  typeof media !== 'number'
                    ? likes.indexOf(media) != -1
                      ? style.checked
                      : ''
                    : ''
                }`}
                onClick={() => {
                  let temp = [...likes];

                  if (typeof media !== 'number') {
                    if (likes.indexOf(media) != -1) {
                      temp = temp.filter((e: MediaData) => {
                        return e.mediaId !== media.mediaId;
                      });
                    } else if (media) {
                      if (temp.length >= 10) return;
                      temp.push(media);
                    }
                  }

                  setLikes(temp);
                }}
                ref={card}
              >
                <div>
                  <FontAwesomeIcon icon={faCheck} />
                </div>
                <Card isLoading={isMutating} data={media}></Card>
              </div>
            );
          })}
        {mediaData && row
          ? [...Array(Math.floor(row - (mediaData.length % row))).keys()].map(
              (_, i: number) => {
                if (mediaData.length % row === 0) {
                  return null;
                }
                return <div key={i} className={cardStyle.container}></div>;
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
