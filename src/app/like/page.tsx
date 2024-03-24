'use client';

import type { MediaData, FilterType } from '@/types/media';
import type { Dispatch, ForwardedRef, SetStateAction } from 'react';

import axios from 'axios';

import style from '@/styles/Like.module.css';
import cardStyle from '@/styles/ui/Card.module.css';

import useSWRMutation from 'swr/mutation';
import { useSession } from 'next-auth/react';

import Card from '@/components/ui/Card';
import Filter from '@/components/ui/Filter';
import { useState, useEffect, useRef, forwardRef } from 'react';
import {
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from '@nextui-org/react';
import { redirect } from 'next/navigation';
import { signIn } from 'next-auth/react';

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
  const session = useSession();

  if (session.status === 'unauthenticated') {
    signIn();
  } else if (session.status === 'authenticated') {
    if (session.data.user.likes) {
      redirect('/');
    }
  }

  const [filter, setFilter] = useState<FilterType>({
    title: '',
    genre: [],
    type: [],
    updateDays: [],
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
    <div className={style.container}>
      <div className={style.submitContainer}>
        {likes.length >= 1 ? (
          <Button
            className={style.btn}
            onClick={() => {
              if (likes.length >= 1) axios.post('/api/like', { likes });
            }}
          >
            제출하기
          </Button>
        ) : (
          <Button isDisabled className={`${style.btn}`}>
            제출하기
          </Button>
        )}
      </div>
      <FirstModal></FirstModal>
      <Filter filter={filter} setFilter={setFilter} />
      <div className={style.mediaContainer}>
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
                return <div key={i} className={cardStyle.container}></div>;
              }
            )
          : null}
        {data ? null : (
          <div className={`${cardStyle.container} h-4`} ref={card}></div> //더미 카드 초반 카드 width를 알기위함
        )}
        <div id='observer' className={style.observer}></div>
      </div>
    </div>
  );
}

function FirstModal() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  useEffect(() => {
    onOpen();
  }, []);

  return (
    <Modal backdrop='blur' isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className='flex flex-col gap-1'>
              좋아하는 작품을 골라주세요!
            </ModalHeader>
            <ModalBody>
              <p>
                좋아하거나 즐겨본 작품을 골라주세요. <br />
                작품을 추천하거나 소개할 알고리즘을 위해 이 데이터가 사용됩니다.
              </p>
            </ModalBody>
            <ModalFooter>
              <Button className={style.btn} onPress={onClose}>
                알겠어요
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
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
