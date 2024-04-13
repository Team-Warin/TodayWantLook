'use client';

import type { MediaData, FilterType } from '@/types/media';
import type { Dispatch, ForwardedRef, SetStateAction } from 'react';
import type { NavigateOptions } from 'next/dist/shared/lib/app-router-context.shared-runtime';

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
import { useRouter } from 'next/navigation';
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

/**
 * /like 페이지
 */
export default function Like() {
  const session = useSession();
  const { push } = useRouter();

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
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
    if (session.status === 'unauthenticated') {
      signIn();
    } else if (session.status === 'authenticated') {
      if (session.data.user.likes) {
        push('/');
      }
    }

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
              if (likes.length >= 1) {
                onOpen();
              }
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
      <NoteModal />
      <SubmitModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        likes={likes}
        setLikes={setLikes}
        push={push}
      />
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

/**
 * Modal 알림
 */
function NoteModal() {
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

/**
 * 제출 modal
 */
function SubmitModal({
  isOpen,
  onOpenChange,
  likes,
  setLikes,
  push,
}: {
  isOpen: boolean;
  onOpenChange: () => void;
  likes: MediaData[];
  setLikes: Dispatch<SetStateAction<MediaData[]>>;
  push: (href: string, options?: NavigateOptions) => void;
}) {
  return (
    <Modal backdrop='blur' isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className='flex flex-col gap-1'>
              선택한 선호하는 작품!!
            </ModalHeader>
            <ModalBody>
              {likes.map((media, i) => {
                return (
                  <div key={i} className='flex justify-between'>
                    <p>{media.title}</p>
                    <p
                      className='cursor-pointer transition-transform hover:scale-110'
                      onClick={() => {
                        let temp = [...likes];

                        temp = temp.filter((e: MediaData) => {
                          return e.mediaId !== media.mediaId;
                        });

                        if (temp.length < 1) onClose();

                        setLikes(temp);
                      }}
                    >
                      ❌
                    </p>
                  </div>
                );
              })}
            </ModalBody>
            <ModalFooter>
              <Button color='danger' variant='light' onPress={onClose}>
                조금 더 생각해볼래요
              </Button>
              <Button
                className={style.btn}
                onPress={() => {
                  if (likes.length >= 1) {
                    axios.post('/api/like', { likes }).then((res) => {
                      if (res.status == 200) push('/');
                    });
                    onClose();
                  }
                }}
              >
                제출하기!
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

/**
 * Item Card
 * data가 number거나 isLoading이 true라면 Skeleton UI return
 * data가 MediaData고 isLoading이 false라면 작품 Card return
 * @param {boolean} isLoading
 * @param {number | MediaData} data
 * @param {MediaData[]} likes
 * @param {Dispatch<SetStateAction<MediaData[]>>} setLikes
 */
const LikeMedia = forwardRef(
  (
    { isLoading, data, likes, setLikes }: LikeMediaProps,
    ref: ForwardedRef<HTMLDivElement>
  ) => {
    if (isLoading) {
      return <Card isLoading={isLoading} data={data} ref={ref}></Card>;
    } else if (typeof data !== 'number') {
      return (
        <div
          ref={ref}
          className={`${style.checkbox} ${
            likes.indexOf(data) != -1 ? style.checked : ''
          }`}
          onClick={() => {
            let temp = [...likes];

            if (typeof data !== 'number') {
              if (likes.indexOf(data) != -1) {
                temp = temp.filter((e: MediaData) => {
                  return e.mediaId !== data.mediaId;
                });
              } else if (data) {
                temp.push(data);
              }
            }

            setLikes(temp);
          }}
        >
          <Card isLoading={isLoading} data={data}></Card>
        </div>
      );
    }

    LikeMedia.displayName = 'LikeMedia';
  }
);
