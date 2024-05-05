'use client';

import type { MediaData } from '@/types/media';

import style from '@/styles/Media.module.css';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

import { useRouter } from 'next/navigation';

import addLikes from '@/action/likes';

import { Code } from '@nextui-org/code';
import Media from '@/components/Media';

import { Button } from '@nextui-org/button';
import { Popover, PopoverTrigger, PopoverContent } from '@nextui-org/popover';

const ShowModal = dynamic(() => import('@/components/Modal'));

/**
 * /like 페이지
 */
export default function Like() {
  const router = useRouter();

  const max = 10;

  const session = useSession();

  let [like, setLike] = useState<MediaData[]>([]);
  let [isOpen, setIsOpen] = useState<boolean>(false);

  useEffect(() => {
    const PopoverClose = () => setIsOpen(false);

    window.addEventListener('scroll', PopoverClose);

    return () => {
      window.removeEventListener('scroll', PopoverClose);
    };
  }, []);

  return (
    <>
      <ShowModal
        defaultOpen={true}
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
      <Media max={max} like={like} setLike={setLike} />
      <div className={style.submitContainer}>
        <div>
          <Popover
            placement='top-start'
            isOpen={isOpen}
            onOpenChange={(open) => setIsOpen(open)}
          >
            <PopoverTrigger>
              <Button variant='light' size='lg'>
                {like.length} / {max}
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <div className='px-1 py-2'>
                {like.length < 1 ? (
                  <p>아직 아무것도 선택하지 않았습니다.</p>
                ) : null}
                {like.map((media: MediaData, i: number) => {
                  return (
                    <div
                      key={i}
                      className='flex justify-between items-center gap-5'
                    >
                      <p>{media.title}</p>
                      <Button
                        size='sm'
                        variant='light'
                        color='danger'
                        onClick={() => {
                          let temp = [...like];

                          temp = temp.filter(
                            (e) => e.mediaId !== media.mediaId
                          );

                          setLike(temp);
                        }}
                      >
                        삭제
                      </Button>
                    </div>
                  );
                })}
              </div>
            </PopoverContent>
          </Popover>
          <Button
            color='primary'
            onClick={async () => {
              await addLikes(like);
              session.update('update');
              router.push('/');
            }}
          >
            제출하기
          </Button>
        </div>
      </div>
    </>
  );
}
